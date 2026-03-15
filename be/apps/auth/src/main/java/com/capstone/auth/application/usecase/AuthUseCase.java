package com.capstone.auth.application.usecase;

import com.capstone.auth.application.business.dto.UserDTO;
import com.capstone.auth.application.business.profile.ProfileService;
import com.capstone.auth.application.business.roles.RoleService;
import com.capstone.auth.application.business.users.UserService;
import com.capstone.auth.application.business.dto.ProfileDTO;
import com.capstone.auth.application.dto.request.users.NewUserRequest;
import com.capstone.auth.application.dto.request.keycloakparam.Credential;
import com.capstone.auth.application.dto.request.keycloakparam.TokenExchangeParam;
import com.capstone.auth.application.dto.request.keycloakparam.UserCreationParam;
import com.capstone.auth.application.dto.response.UserProfileResponse;
import com.capstone.auth.application.event.producer.message.AccountCreationEvent;
import com.capstone.auth.application.event.producer.MessageProducer;
import com.capstone.auth.application.exception.AccountBlockedException;
import com.capstone.common.exception.NotExistingException;

import com.capstone.common.enumerate.RoleName;
import com.capstone.auth.infrastructure.utils.Message;
import com.capstone.auth.infrastructure.service.KeycloakService;
import com.capstone.auth.infrastructure.utils.AuthUtils;
import com.capstone.common.utils.SharedMessage;
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

//import org.keycloak.admin.client.KeycloakBuilder;
//import org.keycloak.OAuth2Constants;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthUseCase {
  UserService uSrv;
  ProfileService pSrv;
  RoleService rSrv;
  MessageProducer template;
  Keycloak keycloak;
  KeycloakService keycloakService;

  @NonFinal
  @Value("${sending_mail.account_creation.subject}")
  String SUBJECT;

  @NonFinal
  @Value("${sending_mail.account_creation.template}")
  String TEMPLATE;

  @Value("${keycloak.realms}")
  @NonFinal
  String realm;

  // @Value("${keycloak.server-url}")
  // @NonFinal
  // String serverUrl;

  // @Value("${keycloak.client-id}")
  // @NonFinal
  // String clientId;

  // @Value("${keycloak.client-secret}")
  // @NonFinal
  // String clientSecret;

  @Value("${keycloak.client-id-admin}")
  @NonFinal
  String clientId;

  @Value("${keycloak.client-secret-admin}")
  @NonFinal
  String clientSecret;

  public UserProfileResponse login(String userId, String email, String username) {
    var user = uSrv.getUserById(userId);
    Objects.requireNonNull(user, Message.SE_03);

    AuthUtils.validateCredentials(user, email, username);

    if (!uSrv.checkExistence(email) || !uSrv.checkExistence(username)) {
      throw new NotExistingException(Message.SE_04);
    }

    // kiem tra xem tai khoan co bi khoa hay khong
    if (user.isLocked()) {
      throw new AccountBlockedException(Message.SE_06);
    }

    var profile = pSrv.getProfileById(userId);
    Objects.requireNonNull(profile, Message.SE_05);

    return returnUserProfile(profile, user);
  }

  @Transactional(rollbackOn = Exception.class)
  public void register(@NonNull NewUserRequest request) throws ExecutionException, InterruptedException {
    Objects.requireNonNull(request.username(), SharedMessage.MES_18);
    Objects.requireNonNull(request.email(), SharedMessage.MES_02);
    Objects.requireNonNull(request.role(), Message.PT_13);
    Objects.requireNonNull(request.jobIds(), Message.PT_12);
    Objects.requireNonNull(request.departmentId(), Message.PT_11);
    Objects.requireNonNull(request.waterSupplyNetworkId(), Message.PT_10);

    var role = rSrv.getRoleByName(RoleName.valueOf(request.role()));
    Objects.requireNonNull(role, Message.SE_07);

    uSrv.createEmployee(
      request.username(), request.email(), role, request.jobIds(),
      request.departmentId(), request.waterSupplyNetworkId(), request.fullName(),
      request.phoneNumber());

    uploadNewUserToKeycloak(request.username(), request.password(), request.role(), request.email());
    template.sendMessage(new AccountCreationEvent(request.email(), SUBJECT, TEMPLATE,
      request.fullName(), request.username(), request.password()));
  }

  public void changePassword(String userId, String email, @NonNull String oldPassword,
                             @NonNull String newPassword, String confirmPassword) {
    if (oldPassword.equals(newPassword)) {
      throw new IllegalArgumentException("Mật khẩu mới phải khác mật khẩu cũ");
    }

    if (!newPassword.equals(confirmPassword)) {
      throw new IllegalArgumentException("Mật khẩu mới và xác nhận mật khẩu không khớp");
    }

    // Xác thực mật khẩu cũ với Keycloak
    verifyOldPassword(email, oldPassword);

    uSrv.updatePassword(email, oldPassword, newPassword);

    // Cập nhật mật khẩu mới trên Keycloak
    updatePasswordOnKeycloak(userId, newPassword);
  }

  private void verifyOldPassword(String email, String oldPassword) {
    // try (Keycloak tempKeycloak = KeycloakBuilder.builder()
    // .serverUrl(serverUrl)
    // .realm(realm)
    // .clientId(clientId)
    // .clientSecret(clientSecret)
    // .username(email)
    // .password(oldPassword)
    // .grantType(OAuth2Constants.PASSWORD)
    // .build()) {
    // Thử lấy token để xác thực mật khẩu
    // tempKeycloak.tokenManager().getAccessToken();
    keycloak.tokenManager().getAccessToken();
    // log.info("Old password verification successful for email: {}", email);
    // } catch (Exception e) {
    // log.error("Old password verification failed for email: {}", email);
    // throw new IllegalArgumentException("Mật khẩu cũ không chính xác");
    // }
  }

  private void updatePasswordOnKeycloak(String userId, String newPassword) {
    try {
      var credential = new org.keycloak.representations.idm.CredentialRepresentation();
      credential.setType(org.keycloak.representations.idm.CredentialRepresentation.PASSWORD);
      credential.setValue(newPassword);
      credential.setTemporary(false);

      keycloak.realm(realm).users().get(userId).resetPassword(credential);
    } catch (Exception e) {
      throw new IllegalArgumentException("Failed to update password on Keycloak: " + e.getMessage());
    }
  }

  public boolean checkExistence(String value) {
    return uSrv.checkExistence(value);
  }

  // <editor-fold> desc="create new user on keycloak"
  private String uploadNewUserToKeycloak(String username, String password, String roleName, String email) {
    var realmResource = keycloak.realm(realm);

    // check trung username
    var users = realmResource.users().search(username, true);
    if (!users.isEmpty()) {
      throw new IllegalArgumentException("Username already exists");
    }

    var token = keycloakService.exchangeToken(TokenExchangeParam.builder()
      .grantType("client_credentials")
      .clientId(clientId)
      .clientSecret(clientSecret)
      .scope("openid").build());
    var response = keycloakService.createUser(
      "Bearer " + token.accessToken(),
      UserCreationParam.builder()
        .username(username)
        .enabled(true)
        .email(email)
        .emailVerified(false)
        .firstName(null)
        .lastName(null)
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
    var role = keycloakService.getRealmRole(
      "Bearer " + token,
      roleName);

    var rolePayload = List.of(Map.of(
      "id", role.get("id"),
      "name", role.get("name")));

    keycloakService.assignRealmRole(
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
      user.userId()
    );
  }
}
