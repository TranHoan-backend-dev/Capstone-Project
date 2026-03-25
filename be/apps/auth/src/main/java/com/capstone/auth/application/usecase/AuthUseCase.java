package com.capstone.auth.application.usecase;

import com.capstone.auth.application.business.dto.UserDTO;
import com.capstone.auth.application.business.profile.ProfileService;
import com.capstone.auth.application.business.roles.RoleService;
import com.capstone.auth.application.business.users.UserService;
import com.capstone.auth.application.business.dto.ProfileDTO;
import com.capstone.auth.application.dto.request.keycloakparam.LoginParam;
import com.capstone.auth.application.dto.request.users.NewUserRequest;
import com.capstone.auth.application.dto.request.keycloakparam.Credential;
import com.capstone.auth.application.dto.request.keycloakparam.TokenExchangeParam;
import com.capstone.auth.application.dto.request.keycloakparam.UserCreationParam;
import com.capstone.auth.application.dto.response.TokenResponse;
import com.capstone.auth.application.dto.response.UserProfileResponse;
import com.capstone.auth.application.event.producer.message.AccountCreationEvent;
import com.capstone.auth.application.event.producer.MessageProducer;
import com.capstone.auth.application.event.producer.message.UpdatePasswordEvent;
import com.capstone.auth.application.exception.AccountBlockedException;
import com.capstone.auth.infrastructure.service.NetworkService;
import com.capstone.auth.infrastructure.service.OrganizationService;
import com.capstone.auth.infrastructure.service.keycloak.KeycloakService;
import com.capstone.common.exception.ExistingException;
import com.capstone.common.exception.NotExistingException;

import com.capstone.common.enumerate.RoleName;
import com.capstone.auth.infrastructure.utils.Message;
import com.capstone.auth.infrastructure.service.keycloak.KeycloakFeignClient;
import com.capstone.auth.infrastructure.utils.AuthUtils;
import jakarta.transaction.Transactional;
import org.jspecify.annotations.NonNull;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.keycloak.admin.client.Keycloak;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.ExecutionException;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthUseCase {
  UserService uSrv;
  ProfileService pSrv;
  RoleService rSrv;
  MessageProducer template;
  Keycloak keycloak;
  KeycloakFeignClient keycloakFeignClient;
  KeycloakService keycloakService;
  NetworkService netWorkService;
  OrganizationService organizationService;

  // <editor-fold> desc="creating new account"
  @NonFinal
  @Value("${sending_mail.account_creation.subject}")
  String CREATION_SUBJECT;

  @NonFinal
  @Value("${sending_mail.account_creation.template}")
  String CREATION_TEMPLATE;

  @Value("${rabbit-mq-config.routing_key}")
  @NonFinal
  String CREATED_ROUTING_KEY;
  // </editor-fold>

  // <editor-fold> desc="updating password"
  @NonFinal
  @Value("${sending_mail.change_password.subject}")
  String CHANGE_PASSWORD_SUBJECT;

  @NonFinal
  @Value("${sending_mail.change_password.template}")
  String CHANGE_PASSWORD_TEMPLATE;

  @Value("${rabbit-mq-config.update_password_routing_key}")
  @NonFinal
  String UPDATE_PASSWORD_ROUTING_KEY;
  // </editor-fold>

  @Value("${keycloak.realms}")
  @NonFinal
  String realm;

  @Value("${keycloak.client-id}")
  @NonFinal
  String clientId;

  @Value("${keycloak.client-secret}")
  @NonFinal
  String clientSecret;

  @Value("${keycloak.client-id-admin}")
  @NonFinal
  String adminClientId;

  @Value("${keycloak.client-secret-admin}")
  @NonFinal
  String adminClientSecret;

  public TokenResponse login(String username, String password) {
    if (!uSrv.checkExistence(username)) {
      throw new NotExistingException(Message.SE_04);
    }
    var user = uSrv.getByUserNameOrEmail(username);

    // kiem tra xem tai khoan co bi khoa hay khong
    if (user.isLocked()) {
      throw new AccountBlockedException(Message.SE_06);
    }

    var profile = pSrv.getProfileById(user.userId());
    Objects.requireNonNull(profile, Message.SE_05);

    var token = keycloakFeignClient.login(LoginParam.builder()
      .grantType("password")
      .clientId(clientId)
      .clientSecret(clientSecret)
      .username(username)
      .password(password)
      .scope("openid")
      .build());

    return new TokenResponse(
      returnUserProfile(profile, user),
      token
    );
  }

  @Transactional(rollbackOn = Exception.class)
  public void register(@NonNull NewUserRequest request) throws ExecutionException, InterruptedException {
    var role = rSrv.getRoleByName(RoleName.valueOf(request.role()));
    Objects.requireNonNull(role, Message.SE_07);

    validateNewUserInformation(request);

    var userId = uploadNewUserToKeycloak(request.firstName(), request.lastName(), request.username(), request.password(), request.role(), request.email());
    var fullName = String.join(" ", request.firstName(), request.lastName());

    uSrv.createEmployee(
      userId, request.username(), request.email(), role, request.jobIds(),
      request.departmentId(), request.waterSupplyNetworkId(), fullName,
      request.phoneNumber());

    template.sendMessage(CREATED_ROUTING_KEY, new AccountCreationEvent(
      request.email(), CREATION_SUBJECT, CREATION_TEMPLATE,
      fullName, request.username(), request.password()));
  }

  public void changePassword(String userId, String email, @NonNull String oldPassword, @NonNull String newPassword) {
    if (!uSrv.checkExistence(email) && !uSrv.isUserExists(userId)) {
      throw new IllegalArgumentException(Message.SE_03);
    }

    if (oldPassword.equals(newPassword)) {
      throw new IllegalArgumentException(Message.SE_13);
    }

    // Xác thực mật khẩu cũ với Keycloak
    keycloakService.verifyOldPassword(email, oldPassword);

    // Cập nhật mật khẩu mới trên Keycloak
    keycloakService.updatePasswordOnKeycloak(userId, newPassword);

    var fullName = pSrv.getFullName(userId);

    template.sendMessage(UPDATE_PASSWORD_ROUTING_KEY, new UpdatePasswordEvent(
      email, CHANGE_PASSWORD_SUBJECT, CHANGE_PASSWORD_TEMPLATE, fullName));
  }

  public boolean checkExistence(String value) {
    return uSrv.checkExistence(value);
  }

  // <editor-fold> desc="create new user on keycloak"
  private String uploadNewUserToKeycloak(String firstName, String lastName, String username, String password,
                                         String roleName, String email) {
    var realmResource = keycloak.realm(realm);

    // check trung username
    var users = realmResource.users().search(username, true);
    if (!users.isEmpty()) {
      throw new IllegalArgumentException("Username already exists");
    }

    var token = keycloakFeignClient.exchangeToken(TokenExchangeParam.builder()
      .grantType("client_credentials")
      .clientId(adminClientId)
      .clientSecret(adminClientSecret)
      .scope("openid").build());
    var response = keycloakFeignClient.createUser(
      "Bearer " + token.accessToken(),
      UserCreationParam.builder()
        .username(username)
        .enabled(true)
        .email(email)
        .emailVerified(true)
        .firstName(firstName)
        .lastName(lastName)
        .credentials(List.of(new Credential("password", password, false)))
        .build());
    var userId = extractUserId(response);

    assignRole(roleName, userId, token.accessToken());

    return userId;
  }

  private String extractUserId(@NonNull ResponseEntity<?> response) {
    List<String> locations = response.getHeaders().get("Location");
    if (locations == null || locations.isEmpty()) {
      throw new IllegalArgumentException("No location header found");
    }
    var location = locations.getFirst();
    var splitStr = location.split("/");
    return splitStr[splitStr.length - 1];
  }

  private void assignRole(String roleName, String userId, String token) {
    var role = keycloakFeignClient.getRealmRole(
      "Bearer " + token,
      roleName);

    var rolePayload = List.of(Map.of(
      "id", role.get("id"),
      "name", role.get("name")));

    keycloakFeignClient.assignRealmRole(
      "Bearer " + token,
      userId,
      rolePayload);
  }
  // </editor-fold>

  private @NonNull UserProfileResponse returnUserProfile(@NonNull ProfileDTO profile, @NonNull UserDTO user) {
    return new UserProfileResponse(
      profile.fullname(),
      profile.avatarUrl(),
      profile.address(),
      profile.phoneNumber(),
      profile.gender().toString(),
      profile.birthday() == null ? null : profile.birthday().toString(),
      user.role().toLowerCase(),
      user.username(),
      user.email(),
      user.userId(),
      user.electronicSigningUrl());
  }

  private void validateNewUserInformation(@NonNull NewUserRequest request) {
    if (uSrv.checkExistence(request.email())) {
      throw new ExistingException(Message.SE_01);
    }
    if (pSrv.existsByPhone(request.phoneNumber())) {
      throw new IllegalArgumentException(Message.SE_08);
    }
    if (!netWorkService.checkExistence(request.waterSupplyNetworkId())) {
      throw new NotExistingException(Message.SE_09);
    }
    if (!organizationService.checkDepartmentExistence(request.departmentId())) {
      throw new NotExistingException(Message.SE_10);
    }
    var invalidJobs = request.jobIds().stream()
      .filter(jid -> !organizationService.checkJobExistence(jid))
      .toList();
    if (!invalidJobs.isEmpty())
      throw new NotExistingException("Jobs not exist: " + invalidJobs);
  }
}
