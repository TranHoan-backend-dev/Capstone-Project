package com.capstone.auth.application.usecase;

import com.capstone.auth.application.business.dto.UserDTO;
import com.capstone.auth.application.business.profile.ProfileService;
import com.capstone.auth.application.business.roles.RoleService;
import com.capstone.auth.application.business.users.UserService;
import com.capstone.auth.application.business.dto.ProfileDTO;
import com.capstone.auth.application.dto.response.UserProfileResponse;
import com.capstone.auth.application.event.producer.AccountCreationEvent;
import com.capstone.auth.application.event.producer.MessageProducer;
import com.capstone.auth.application.exception.AccountBlockedException;
import com.capstone.auth.application.exception.NotExistingException;

import com.capstone.auth.infrastructure.config.Constant;
import com.capstone.auth.infrastructure.utils.Utils;
import org.jspecify.annotations.NonNull;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Objects;
import java.util.concurrent.ExecutionException;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.CredentialRepresentation;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthUseCase {
  UserService uSrv;
  ProfileService pSrv;
  RoleService rSrv;
  MessageProducer template;
  
  Keycloak keycloak;

  @NonFinal
  @Value("${sending_mail.account_creation.subject}")
  String SUBJECT;

  @NonFinal
  @Value("${sending_mail.account_creation.template}")
  String TEMPLATE;

  @Value("${keycloak.realms}")
  @NonFinal
  String realm;

  public UserProfileResponse login(String userId, String email, String username) {
    log.info("Handling login business with userId={} and email={}", userId, email);
    var user = uSrv.getUserById(userId);
    Objects.requireNonNull(user, Constant.SE_04);

    Utils.validateCredentials(user, email, username);

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

  public void register(
    String username, String password,
    String email, String roleId, String fullname,
    String jobId, String businessPageIds,
    String departmentId, String waterSupplyNetworkId) throws ExecutionException, InterruptedException {
    log.info("AuthUseCase is handling business");

    Objects.requireNonNull(username, Constant.PT_05);
    Objects.requireNonNull(email, Constant.PT_03);
    Objects.requireNonNull(roleId, Constant.PT_23);
    Objects.requireNonNull(jobId, Constant.PT_20);
    Objects.requireNonNull(businessPageIds, Constant.PT_21);
    Objects.requireNonNull(departmentId, Constant.PT_19);
    Objects.requireNonNull(waterSupplyNetworkId, Constant.PT_18);

    var role = rSrv.getRoleById(roleId);
    Objects.requireNonNull(role, Constant.SE_08);
    uSrv.createEmployee(
      username, email, role,
      jobId, businessPageIds, departmentId, waterSupplyNetworkId);

    log.info("User has been registered successfully");
    template.sendMessage(new AccountCreationEvent(email, SUBJECT, TEMPLATE,
      fullname, username, password));
  }

  public void changePassword(String userId, String email, String oldPassword, @NonNull String newPassword, String confirmPassword) {
    log.info("Handling change password for email: {}", email);
    if (!newPassword.equals(confirmPassword)) {
      throw new IllegalArgumentException("New password and confirm password do not match");
    }
    uSrv.updatePassword(email, oldPassword, newPassword);
    
    // Update password on Keycloak
    updatePasswordOnKeycloak(userId, newPassword);
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
