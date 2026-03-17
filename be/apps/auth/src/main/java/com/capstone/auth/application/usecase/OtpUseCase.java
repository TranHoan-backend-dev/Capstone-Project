package com.capstone.auth.application.usecase;

import com.capstone.auth.application.business.users.UserService;
import com.capstone.auth.application.event.producer.MessageProducer;
import com.capstone.auth.application.event.producer.message.OtpEvent;
import com.capstone.auth.infrastructure.service.keycloak.KeycloakService;
import com.capstone.auth.infrastructure.utils.Message;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import com.capstone.auth.application.business.profile.ProfileService;
import com.capstone.auth.application.business.verification.VerificationService;
import org.slf4j.Logger;
import com.capstone.common.annotation.AppLog;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@AppLog
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OtpUseCase {
  VerificationService vSrv;
  MessageProducer producer;
  UserService uSrv;
  ProfileService pSrv;
  KeycloakService keycloakService;
  @NonFinal
  Logger log;

  @NonFinal
  @Value("${sending_mail.otp_verification.subject}")
  String SUBJECT;

  @NonFinal
  @Value("${sending_mail.otp_verification.template}")
  String TEMPLATE;

  @Value("${rabbit-mq-config.verify_otp_routing_key}")
  @NonFinal
  String ROUTING_KEY;

  public void sendOtp(String email) {
    log.info("Sending OTP to email: {}", email);
    var otp = vSrv.createOtp(email);

    // Fetch profile to get name
    String name = "Người dùng";
    var profile = pSrv.getProfileByCredentials(email);
    if (profile != null) {
      name = profile.fullname();
    }
    producer.sendMessage(ROUTING_KEY, new OtpEvent(email, SUBJECT, TEMPLATE, name, otp));
  }

  public boolean verifyOtp(String email, String otp) {
    log.info("Verifying OTP for email: {}", email);
    return vSrv.verifyOtp(email, otp);
  }

  public void resetPasswordWithOtp(String email, String otp, String newPassword) {
    log.info("Resetting password for email: {}", email);

    // Update on Keycloak
    try {
      var user = uSrv.getUserByEmail(email);
      keycloakService.updatePasswordOnKeycloak(user.userId(), newPassword);
    } catch (Exception e) {
      log.error("Failed to update password on Keycloak for email: {}", email, e);
      throw new IllegalArgumentException(Message.SE_11);
    }
  }
}
