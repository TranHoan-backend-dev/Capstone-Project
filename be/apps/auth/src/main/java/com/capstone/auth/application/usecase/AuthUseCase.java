package com.capstone.auth.application.usecase;

import com.capstone.auth.application.business.dto.UserDTO;
import com.capstone.auth.application.business.profile.ProfileService;
import com.capstone.auth.application.business.roles.RoleService;
import com.capstone.auth.application.business.users.UserService;
import com.capstone.auth.application.business.dto.ProfileDTO;
import com.capstone.auth.application.dto.request.NewUserRequest;
import com.capstone.auth.application.dto.request.keycloakparam.Credential;
import com.capstone.auth.application.dto.request.keycloakparam.TokenExchangeParam;
import com.capstone.auth.application.dto.request.keycloakparam.UserCreationParam;
import com.capstone.auth.application.dto.response.UserProfileResponse;
import com.capstone.auth.application.event.producer.AccountCreationEvent;
import com.capstone.auth.application.event.producer.MessageProducer;
import com.capstone.auth.application.exception.AccountBlockedException;
import com.capstone.auth.application.exception.NotExistingException;

import com.capstone.auth.domain.enumerate.RoleName;
import com.capstone.auth.infrastructure.config.Constant;
import com.capstone.auth.infrastructure.service.KeycloakService;
import com.capstone.auth.infrastructure.utils.AuthUtils;
import com.capstone.common.annotation.AppLog;
import jakarta.transaction.Transactional;
import org.jspecify.annotations.NonNull;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.slf4j.Logger;
import org.keycloak.admin.client.Keycloak;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ExecutionException;

import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.OAuth2Constants;

@AppLog
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
  Logger log;

  @NonFinal
  @Value("${sending_mail.account_creation.subject}")
  String SUBJECT;

  @NonFinal
  @Value("${sending_mail.account_creation.template}")
  String TEMPLATE;

  @Value("${keycloak.realms:master}")
  @NonFinal
  String realm;

  @Value("${keycloak.server-url}")
  @NonFinal
  String serverUrl;

  @Value("${keycloak.client-id}")
  @NonFinal
  String clientId;

  @Value("${keycloak.client-secret}")
  @NonFinal
  String clientSecret;

//  @Value("${keycloak.client-id-admin}")
//  @NonFinal
//  String clientId;
//
//  @Value("${keycloak.client-secret-admin}")
//  @NonFinal
//  String clientSecret;

  public UserProfileResponse login(String userId, String email, String username) {
    log.info("Handling login business with userId={} and email={}", userId, email);
    var user = uSrv.getUserById(userId);
    Objects.requireNonNull(user, Constant.SE_04);

    AuthUtils.validateCredentials(user, email, username);

    if (!uSrv.checkExistence(email) || !uSrv.checkExistence(username)) {
      throw new NotExistingException(Constant.SE_05);
    }

    // kiem tra xem tai khoan co bi khoa hay khong
    if (user.isLocked()) {
      throw new AccountBlockedException(Constant.SE_07);
    }

    var profile = pSrv.getProfileById(userId);
    Objects.requireNonNull(profile, Constant.SE_06);

    return returnUserProfile(profile, user);
  }

  @Transactional(rollbackOn = Exception.class)
  public void register(@NonNull NewUserRequest request) throws ExecutionException, InterruptedException {
    log.info("AuthUseCase is handling business");

    Objects.requireNonNull(request.username(), Constant.PT_05);
    Objects.requireNonNull(request.email(), Constant.PT_03);
    Objects.requireNonNull(request.role(), Constant.PT_23);
    Objects.requireNonNull(request.jobIds(), Constant.PT_20);
    Objects.requireNonNull(request.departmentId(), Constant.PT_19);
    Objects.requireNonNull(request.waterSupplyNetworkId(), Constant.PT_18);

    var role = rSrv.getRoleByName(RoleName.valueOf(request.role()));
    Objects.requireNonNull(role, Constant.SE_08);

    uSrv.createEmployee(
      request.username(), request.email(), role, request.jobIds(),
      request.departmentId(), request.waterSupplyNetworkId(), request.fullName(),
      request.phoneNumber()
    );

    var id = uploadNewUserToKeycloak(request.username(), request.password(), request.role(), request.email());
    log.info("User id: {}", id);

    log.info("User has been registered successfully");
    template.sendMessage(new AccountCreationEvent(request.email(), SUBJECT, TEMPLATE,
      request.fullName(), request.username(), request.password()));
  }

  public void changePassword(String userId, String email, String oldPassword, @NonNull String newPassword, String confirmPassword) {
    log.info("Handling change password for email: {}", email);

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
    log.info("Verifying old password for email: {}", email);
    try (Keycloak tempKeycloak = KeycloakBuilder.builder()
        .serverUrl(serverUrl)
        .realm(realm)
        .clientId(clientId)
        .clientSecret(clientSecret)
        .username(email)
        .password(oldPassword)
        .grantType(OAuth2Constants.PASSWORD)
        .build()) {
      // Thử lấy token để xác thực mật khẩu
      tempKeycloak.tokenManager().getAccessToken();
      log.info("Old password verification successful for email: {}", email);
    } catch (Exception e) {
      log.error("Old password verification failed for email: {}", email);
      throw new IllegalArgumentException("Mật khẩu cũ không chính xác");
    }
  }

  private void updatePasswordOnKeycloak(String userId, String newPassword) {
    log.info("Updating password on Keycloak for user: {}", userId);
    try {
      var credential = new org.keycloak.representations.idm.CredentialRepresentation();
      credential.setType(org.keycloak.representations.idm.CredentialRepresentation.PASSWORD);
      credential.setValue(newPassword);
      credential.setTemporary(false);

      keycloak.realm(realm).users().get(userId).resetPassword(credential);
      log.info("Successfully updated password on Keycloak");
    } catch (Exception e) {
      log.error("Failed to update password on Keycloak", e);
      throw new IllegalArgumentException("Failed to update password on Keycloak: " + e.getMessage());
    }
  }

  public boolean checkExistence(String value) {
    log.info("Checking existence of username and email: {}", value);
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

    log.info("Upload new user to Keycloak");
    var token = keycloakService.exchangeToken(TokenExchangeParam.builder()
      .grantType("client_credentials")
      .clientId(clientId)
      .clientSecret(clientSecret)
      .scope("openid").build()
    );
    log.info("Token info: {}", token);
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
        .build()
    );
    var userId = extractUserId(response);
    log.info("User ID: {}", userId);

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
      roleName
    );

    var rolePayload = List.of(Map.of(
      "id", role.get("id"),
      "name", role.get("name")
    ));

    keycloakService.assignRealmRole(
      "Bearer " + token,
      userId,
      rolePayload
    );
  }
  // </editor-fold>

  private UserProfileResponse returnUserProfile(@NonNull ProfileDTO profile, @NonNull UserDTO user) {
    return new UserProfileResponse(
      profile.fullname(),
      profile.avatarUrl(),
      profile.address(),
      profile.phoneNumber(),
      profile.gender().toString(),
      profile.birthday() == null ? null : profile.birthday().toString(),
      user.role().toLowerCase(),
      user.username(),
      user.email());
  }
}
