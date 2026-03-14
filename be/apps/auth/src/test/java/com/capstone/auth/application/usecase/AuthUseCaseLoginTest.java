package com.capstone.auth.application.usecase;

import com.capstone.auth.application.business.dto.ProfileDTO;
import com.capstone.auth.application.business.dto.UserDTO;
import com.capstone.auth.application.business.profile.ProfileService;
import com.capstone.auth.application.business.users.UserService;
import com.capstone.auth.application.exception.AccountBlockedException;
import com.capstone.auth.application.exception.NotExistingException;
import com.capstone.auth.infrastructure.utils.Message;

import java.time.LocalDate;

import com.capstone.common.utils.SharedMessage;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthUseCaseLoginTest {
  @Mock
  UserService userService;

  @Mock
  ProfileService profileService;

  @InjectMocks
  AuthUseCase authUseCase;

  @Test
  void login_returns_profile_response_for_valid_credentials() {
    var userId = "user-1";
    var email = "user@example.com";
    var username = "user1";
    var user = new UserDTO(userId, "IT_DEPARTMENT_STAFF", username, email, false, null, null, null, null, null, null,
      null,
      null, true);
    var profile = new ProfileDTO(
      userId,
      "User One",
      "avatar.png",
      "HCM",
      "0900000000",
      true,
      LocalDate.parse("2000-01-01"));

    when(userService.getUserById(userId)).thenReturn(user);
    when(userService.checkExistence(email)).thenReturn(true);
    when(userService.checkExistence(username)).thenReturn(true);
    when(profileService.getProfileById(userId)).thenReturn(profile);

    var response = authUseCase.login(userId, email, username);

    assertNotNull(response);
    assertEquals(profile.fullname(), response.fullname());
    assertEquals(profile.avatarUrl(), response.avatarUrl());
    assertEquals(profile.address(), response.address());
    assertEquals(profile.phoneNumber(), response.phoneNumber());
    assertEquals(profile.gender().toString(), response.gender());
    assertEquals(profile.birthday().toString(), response.birthday());
    assertEquals(user.role().toLowerCase(), response.role());
    assertEquals(user.username(), response.username());
    assertEquals(user.email(), response.email());
  }

  @Test
  void login_throws_when_email_invalid() {
    var userId = "user-1";
    var email = "invalid-email";
    var username = "user1";
    var user = new UserDTO(userId, "IT_DEPARTMENT_STAFF", username, "user@example.com", false, null, null, null, null,
      null,
      null, null, null, true);

    when(userService.getUserById(userId)).thenReturn(user);

    IllegalArgumentException ex = assertThrows(
      IllegalArgumentException.class,
      () -> authUseCase.login(userId, email, username));

    assertEquals(SharedMessage.MES_01, ex.getMessage());
  }

  @Test
  void login_throws_when_user_locked() {
    var userId = "user-1";
    var email = "user@example.com";
    var username = "user1";
    var user = new UserDTO(userId, "IT_DEPARTMENT_STAFF", username, email, true, null, null, null, null, null, null,
      null, null, true);

    when(userService.getUserById(userId)).thenReturn(user);
    when(userService.checkExistence(email)).thenReturn(true);
    when(userService.checkExistence(username)).thenReturn(true);

    AccountBlockedException ex = assertThrows(
      AccountBlockedException.class,
      () -> authUseCase.login(userId, email, username));

    assertEquals(Message.SE_07, ex.getMessage());
  }

  @Test
  void login_throws_when_credentials_do_not_exist() {
    var userId = "user-1";
    var email = "user@example.com";
    var username = "user1";
    var user = new UserDTO(userId, "IT_DEPARTMENT_STAFF", username, email, false, null, null, null, null, null, null,
      null,
      null, true);

    when(userService.getUserById(userId)).thenReturn(user);
    when(userService.checkExistence(email)).thenReturn(false);

    NotExistingException ex = assertThrows(
      NotExistingException.class,
      () -> authUseCase.login(userId, email, username));

    assertEquals(Message.SE_05, ex.getMessage());
  }

  @Test
  void login_throws_when_user_not_found() {
    var userId = "non-existent";
    var email = "user@example.com";
    var username = "user1";

    when(userService.getUserById(userId)).thenReturn(null);

    NullPointerException ex = assertThrows(
      NullPointerException.class,
      () -> authUseCase.login(userId, email, username));

    assertEquals(Message.SE_04, ex.getMessage());
  }

  @Test
  void login_throws_when_email_mismatch() {
    var userId = "user-1";
    var email = "other@example.com";
    var username = "user1";
    var user = new UserDTO(userId, "IT_DEPARTMENT_STAFF", "user1", "user@example.com", false, null, null, null, null,
      null,
      null, null, null, true);

    when(userService.getUserById(userId)).thenReturn(user);

    IllegalArgumentException ex = assertThrows(
      IllegalArgumentException.class,
      () -> authUseCase.login(userId, email, username));

    assertEquals("Email does not match", ex.getMessage());
  }

  @Test
  void login_throws_when_username_mismatch() {
    var userId = "user-1";
    var email = "user@example.com";
    var username = "wronguser";
    var user = new UserDTO(userId, "IT_DEPARTMENT_STAFF", "user1", email, false, null, null, null, null, null, null,
      null, null, true);

    when(userService.getUserById(userId)).thenReturn(user);

    IllegalArgumentException ex = assertThrows(
      IllegalArgumentException.class,
      () -> authUseCase.login(userId, email, username));

    assertEquals("Username does not match", ex.getMessage());
  }

  @Test
  void login_throws_when_profile_not_found() {
    var userId = "user-1";
    var email = "user@example.com";
    var username = "user1";
    var user = new UserDTO(userId, "IT_DEPARTMENT_STAFF", username, email, false, null, null, null, null, null, null,
      null, null, true);

    when(userService.getUserById(userId)).thenReturn(user);
    when(userService.checkExistence(email)).thenReturn(true);
    when(userService.checkExistence(username)).thenReturn(true);
    when(profileService.getProfileById(userId)).thenReturn(null);

    NullPointerException ex = assertThrows(
      NullPointerException.class,
      () -> authUseCase.login(userId, email, username));

    assertEquals(Message.SE_06, ex.getMessage());
  }
}
