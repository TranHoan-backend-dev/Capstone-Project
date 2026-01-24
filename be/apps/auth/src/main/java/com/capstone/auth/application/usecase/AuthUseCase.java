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
  RoleService rSrv;
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

    validateCredentials(user, email, username);

    if (!uSrv.checkExistence(email) || !uSrv.checkExistence(username)) {
      throw new NotExistingException(Constant.SE_05);
    }

    // kiem tra xem tai khoan co bi khoa hay khong
    if (user.isLocked()) {
      throw new AccountBlockedException(Constant.SE_07);
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
    String username, String password,
    String email, String roleId, String fullname,
    String jobId, String businessPageIds,
    String departmentId, String waterSupplyNetworkId) throws ExecutionException, InterruptedException {
    log.info("AuthUseCase is handling business");

    Objects.requireNonNull(username, Constant.PT_05);
    Objects.requireNonNull(password, Constant.PT_04);
    Objects.requireNonNull(email, Constant.PT_03);
    Objects.requireNonNull(roleId, Constant.PT_23);
    Objects.requireNonNull(jobId, Constant.PT_20);
    Objects.requireNonNull(businessPageIds, Constant.PT_21);
    Objects.requireNonNull(departmentId, Constant.PT_19);
    Objects.requireNonNull(waterSupplyNetworkId, Constant.PT_18);

    var role = rSrv.getRoleById(roleId);
    Objects.requireNonNull(role, Constant.SE_08);
    uSrv.createEmployee(
      username, password, email, role,
      jobId, businessPageIds, departmentId, waterSupplyNetworkId);

    log.info("User has been registered successfully");
    template.sendMessage(new AccountCreationEvent(email, SUBJECT, TEMPLATE,
      fullname, username, password));
  }

  public ProfileDTO getProfile(String id) {
    log.info("Getting profile by id: {}", id);
    return pSrv.getProfileById(id);
  }

  public UserProfileResponse getMe(String id, String email, String username) {
    log.info("Check status and get profile by id: {}", id);
    UserDTO user = uSrv.getUserById(id);

    if (user.isLocked()) {
      throw new DisabledException(Constant.SE_07);
    }

    validateCredentials(user, email, username);

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

  private void validateCredentials(UserDTO user, String email, String username) {
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
  }
}
