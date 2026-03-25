package com.capstone.auth.application.usecase;

import com.capstone.auth.application.business.dto.ProfileDTO;
import com.capstone.auth.application.business.dto.UserDTO;
import com.capstone.auth.application.business.profile.ProfileService;
import com.capstone.auth.application.business.roles.RoleService;
import com.capstone.auth.application.business.users.UserService;
import com.capstone.auth.application.dto.request.keycloakparam.LoginParam;
import com.capstone.auth.application.dto.response.TokenExchangeResponse;
import com.capstone.auth.application.event.producer.MessageProducer;
import com.capstone.auth.application.exception.AccountBlockedException;
import com.capstone.auth.infrastructure.service.NetworkService;
import com.capstone.auth.infrastructure.service.OrganizationService;
import com.capstone.auth.infrastructure.service.keycloak.KeycloakFeignClient;
import com.capstone.auth.infrastructure.service.keycloak.KeycloakService;
import com.capstone.auth.infrastructure.utils.Message;
import com.capstone.common.exception.NotExistingException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.keycloak.admin.client.Keycloak;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthUseCaseLoginTest {
  @Mock
  UserService uSrv;

  @Mock
  ProfileService pSrv;

  @Mock
  RoleService rSrv;

  @Mock
  MessageProducer template;

  @Mock
  Keycloak keycloak;

  @Mock
  KeycloakFeignClient keycloakFeignClient;

  @Mock
  KeycloakService keycloakService;

  @Mock
  NetworkService netWorkService;

  @Mock
  OrganizationService organizationService;

  @InjectMocks
  AuthUseCase authUseCase;

  @Test
  void login_returns_token_response_for_valid_credentials() {
    var userId = "user-1";
    var username = "user1";
    var password = "password123";
    var user = new UserDTO(userId, "IT_DEPARTMENT_STAFF", username, "user@example.com", false, null, null, null, null, null, null,
      null, null, true);
    var profile = new ProfileDTO(
      userId,
      "User One",
      "avatar.png",
      "HCM",
      "0900000000",
      true,
      LocalDate.parse("2000-01-01"));
    var tokenExchangeResponse = new TokenExchangeResponse("access-token", 3600L, 3600L, "refresh-token", "Bearer", 0, "session", "scope");

    when(uSrv.checkExistence(username)).thenReturn(true);
    when(uSrv.getByUserNameOrEmail(username)).thenReturn(user);
    when(pSrv.getProfileById(userId)).thenReturn(profile);
    when(keycloakFeignClient.login(any(LoginParam.class))).thenReturn(tokenExchangeResponse);

    var response = authUseCase.login(username, password);

    assertNotNull(response);
    assertNotNull(response.userDetails());
    assertEquals(profile.fullname(), response.userDetails().fullname());
    assertEquals(profile.avatarUrl(), response.userDetails().avatarUrl());
    assertEquals(profile.address(), response.userDetails().address());
    assertEquals(profile.phoneNumber(), response.userDetails().phoneNumber());
    assertEquals(profile.gender().toString(), response.userDetails().gender());
    assertEquals(profile.birthday().toString(), response.userDetails().birthday());
    assertEquals(user.role().toLowerCase(), response.userDetails().role());
    assertEquals(user.username(), response.userDetails().username());
    assertEquals(user.email(), response.userDetails().email());
    assertEquals(tokenExchangeResponse.accessToken(), response.token().accessToken());
  }

  @Test
  void login_throws_when_credentials_do_not_exist() {
    var username = "user1";
    var password = "password123";

    when(uSrv.checkExistence(username)).thenReturn(false);

    NotExistingException ex = assertThrows(
      NotExistingException.class,
      () -> authUseCase.login(username, password));

    assertEquals(Message.SE_04, ex.getMessage());
  }

  @Test
  void login_throws_when_user_locked() {
    var userId = "user-1";
    var username = "user1";
    var password = "password123";
    var user = new UserDTO(userId, "IT_DEPARTMENT_STAFF", username, "user@example.com", true, null, null, null, null, null, null,
      null, null, true);

    when(uSrv.checkExistence(username)).thenReturn(true);
    when(uSrv.getByUserNameOrEmail(username)).thenReturn(user);

    AccountBlockedException ex = assertThrows(
      AccountBlockedException.class,
      () -> authUseCase.login(username, password));

    assertEquals(Message.SE_06, ex.getMessage());
  }

  @Test
  void login_throws_when_profile_not_found() {
    var userId = "user-1";
    var username = "user1";
    var password = "password123";
    var user = new UserDTO(userId, "IT_DEPARTMENT_STAFF", username, "user@example.com", false, null, null, null, null, null, null,
      null, null, true);

    when(uSrv.checkExistence(username)).thenReturn(true);
    when(uSrv.getByUserNameOrEmail(username)).thenReturn(user);
    when(pSrv.getProfileById(userId)).thenReturn(null);

    NullPointerException ex = assertThrows(
      NullPointerException.class,
      () -> authUseCase.login(username, password));

    assertEquals(Message.SE_05, ex.getMessage());
  }
}

