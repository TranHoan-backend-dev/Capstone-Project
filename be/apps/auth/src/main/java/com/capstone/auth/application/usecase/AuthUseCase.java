package com.capstone.auth.application.usecase;

import com.capstone.auth.application.business.profile.ProfileService;
import com.capstone.auth.application.business.users.UserService;
import com.capstone.auth.application.dto.response.ProfileResponse;
import com.capstone.auth.application.event.producer.MessageProducer;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

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

  public void register(
    String username,
    String password, String email, boolean status
  ) throws ExecutionException, InterruptedException {
    log.info("AuthUseCase is handling business");

//    service.createEmployee(
//      username,
//      password,
//      email,
//      status ? RoleName.EMPLOYEE : RoleName.CUSTOMER);

    log.info("User has been registered successfully");
//    template.sendMessage(new AccountCreationEvent(email, SUBJECT, TEMPLATE, fullName, username, password));
  }

  public ProfileResponse getProfile(String id) {
    log.info("Getting profile by id: {}", id);
    return pSrv.getUserById(id);
  }

  public void resetPassword(String email, String newPassword) {

  }
}
