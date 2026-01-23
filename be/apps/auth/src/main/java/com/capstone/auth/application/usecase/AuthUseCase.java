package com.capstone.auth.application.usecase;

import com.capstone.auth.application.business.dto.UserDTO;
import com.capstone.auth.application.business.profile.ProfileService;
import com.capstone.auth.application.business.users.UserService;
import com.capstone.auth.application.business.dto.ProfileResponse;
import com.capstone.auth.application.dto.response.UserProfileResponse;
import com.capstone.auth.application.event.producer.MessageProducer;
import com.capstone.auth.application.exception.NotExistingException;

import com.capstone.auth.infrastructure.config.Constant;
import org.springframework.security.authentication.DisabledException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Objects;
import java.util.concurrent.ExecutionException;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthUseCase {
  UserService uSrv;
  ProfileService pSrv;
  MessageProducer template;

  @NonFinal
  @Value("${sending_mail.account_creation.subject}")
  String SUBJECT;

  @NonFinal
  @Value("${sending_mail.account_creation.template}")
  String TEMPLATE;

  public UserProfileResponse login(String userId, String email, String username) {
    log.info("Handling login business with userId={} and email={}", userId, email);
    UserDTO user = uSrv.getUserById(userId);
    Objects.requireNonNull(user, Constant.SE_04);

    if (!uSrv.checkExistence(email) || !uSrv.checkExistence(username)) {
      throw new NotExistingException(Constant.SE_05);
    }

    // kiem tra xem tai khoan co bi khoa hay khong
    if (user.isLocked()) {
      throw new NotExistingException(Constant.SE_07);
    }

    if (email != null && email.matches(Constant.EMAIL_PATTERN)) {
      if (!email.equals(user.email())) {
        throw new IllegalArgumentException("Email does not match");
      }
    } else {
      throw new IllegalArgumentException(Constant.PT_01);
    }

    if (username != null) {
      if (!username.equals(user.username())) {
        throw new IllegalArgumentException("Username does not match");
      }
    } else {
      throw new IllegalArgumentException(Constant.PT_05);
    }

    var profile = pSrv.getProfileById(userId);
    Objects.requireNonNull(profile, Constant.SE_06);

    return new UserProfileResponse(
        profile.fullname(),
        profile.avatarUrl(),
        profile.address(),
        profile.phoneNumber(),
        profile.gender(),
        profile.birthday(),
        user.role().toLowerCase(),
        user.username(),
        user.email());
  }

  public void register(
      String username,
      String password, String email, boolean status) throws ExecutionException, InterruptedException {
    log.info("AuthUseCase is handling business");

    // service.createEmployee(
    // username,
    // password,
    // email,
    // status ? RoleName.EMPLOYEE : RoleName.CUSTOMER);

    log.info("User has been registered successfully");
    // template.sendMessage(new AccountCreationEvent(email, SUBJECT, TEMPLATE,
    // fullName, username, password));
  }

  public ProfileResponse getProfile(String id) {
    log.info("Getting profile by id: {}", id);
    return pSrv.getProfileById(id);
  }

  public UserProfileResponse getMe(String id) {
    log.info("Check status and get profile by id: {}", id);
    UserDTO user = uSrv.getUserById(id);

    if (!user.isLocked()) {
      throw new DisabledException(Constant.SE_07);
    }

    var profile = pSrv.getProfileById(id);

    return new UserProfileResponse(
        profile.fullname(),
        profile.avatarUrl(),
        profile.address(),
        profile.phoneNumber(),
        profile.gender(),
        profile.birthday(),
        user.role().toLowerCase(),
        user.username(),
        user.email());
  }

  public boolean checkExistence(String value) {
    log.info("Checking existence of username and email: {}", value);
    return uSrv.checkExistence(value);
  }
}
