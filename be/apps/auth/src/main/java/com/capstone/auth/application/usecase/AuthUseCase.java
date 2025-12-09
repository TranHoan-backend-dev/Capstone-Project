package com.capstone.auth.application.usecase;

import com.capstone.auth.application.business.users.UsersService;
import com.capstone.auth.application.event.producer.AccountCreationEvent;
import com.capstone.auth.application.event.producer.MessageProducer;
import com.capstone.auth.domain.model.enumerate.RoleName;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthUseCase {
  UsersService service;
  MessageProducer template;
  String SUBJECT = "";
  String TEMPLATE = "";

  public void register(String fullName, String username, String password, String email, boolean status) {
    log.info("AuthUseCase is handling business");

    service.createEmployee(
        fullName,
        username,
        password,
        email,
        status ? RoleName.EMPLOYEE : RoleName.CUSTOMER);

    log.info("User has been registered successfully");
    template.sendMessage(new AccountCreationEvent(email, SUBJECT, TEMPLATE, fullName, username, password));
  }
}
