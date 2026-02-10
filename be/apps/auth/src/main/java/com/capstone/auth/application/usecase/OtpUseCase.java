package com.capstone.auth.application.usecase;

import com.capstone.auth.application.business.users.UserService;
import org.springframework.beans.factory.annotation.Value;
import lombok.experimental.NonFinal;
import org.keycloak.admin.client.Keycloak;
import org.springframework.stereotype.Component;

import com.capstone.auth.application.business.verification.VerificationService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OtpUseCase {
  VerificationService vSrv;
  Keycloak keycloak;
  UserService uSrv;

  @Value("${keycloak.realms}")
  @NonFinal
  String realm;

  public void sendOtp(String email) {
    log.info("Sending OTP to email: {}", email);
    vSrv.sendOtp(email);
  }

  public boolean verifyOtp(String email, String otp) {
    log.info("Verifying OTP for email: {}", email);
    return vSrv.verifyOtp(email, otp);
  }

  public void resetPasswordWithOtp(String email, String otp, String newPassword) {
    log.info("Resetting password for email: {}", email);
    vSrv.verifyAndResetPassword(email, otp, newPassword);

    // Update on Keycloak
    try {

        var user = uSrv.getUserByEmail(email);
        updatePasswordOnKeycloak(user.userId(), newPassword);
    } catch (Exception e) {
        log.error("Failed to update password on Keycloak for email: {}", email, e);
        throw new IllegalArgumentException("Failed to sync password to Keycloak");
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
}
