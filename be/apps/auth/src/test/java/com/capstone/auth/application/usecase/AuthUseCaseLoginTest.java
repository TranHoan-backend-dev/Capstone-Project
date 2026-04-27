package com.capstone.auth.application.usecase;

import com.capstone.auth.application.business.dto.ProfileDTO;
import com.capstone.auth.application.business.dto.UserDTO;
import com.capstone.auth.application.business.profile.ProfileService;
import com.capstone.auth.application.business.users.UserService;
import com.capstone.auth.application.dto.request.keycloakparam.TokenParam;
import com.capstone.auth.application.dto.response.TokenExchangeResponse;
import com.capstone.auth.application.exception.AccountBlockedException;
import com.capstone.auth.infrastructure.service.OrganizationService;
import com.capstone.auth.infrastructure.service.keycloak.KeycloakFeignClient;
import com.capstone.auth.infrastructure.utils.Message;
import com.capstone.common.exception.NotExistingException;
import org.mockito.Mockito;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthUseCaseLoginTest {
  @Mock
  UserService uSrv;

  @Mock
  ProfileService pSrv;

  @Mock
  KeycloakFeignClient keycloakFeignClient;

  @Mock
  OrganizationService organizationService;

  @Mock
  JwtDecoder jwtDecoder;

  @Mock
  JwtAuthenticationConverter jwtAuthenticationConverter;

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
    when(keycloakFeignClient.token(any(TokenParam.class))).thenReturn(tokenExchangeResponse);

    // Mock for JWT and Security Context
    Jwt mockJwt = mock(Jwt.class);
    when(jwtDecoder.decode(anyString())).thenReturn(mockJwt);
    when(jwtAuthenticationConverter.convert(any(Jwt.class))).thenReturn(new UsernamePasswordAuthenticationToken("principal", "credentials"));
    when(organizationService.getDepartmentName(any())).thenReturn("IT Department");

    var response = authUseCase.login(username, password, null, null, null);

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
      () -> authUseCase.login(username, password, null, null, null));

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

    var ex = assertThrows(
      AccountBlockedException.class,
      () -> authUseCase.login(username, password, null, null, null));

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

    var ex = assertThrows(
      NullPointerException.class,
      () -> authUseCase.login(username, password, null, null, null));

    assertEquals(Message.SE_05, ex.getMessage());
  }

  @Test
  void refreshToken_returns_token_response_when_valid() {
    var refreshToken = "old-refresh-token";
    var tokenExchangeResponse = new TokenExchangeResponse("new-access-token", 3600L, 3600L, "new-refresh-token", "Bearer", 0, "session", "scope");

    when(keycloakFeignClient.token(any(TokenParam.class))).thenReturn(tokenExchangeResponse);

    var response = authUseCase.refreshToken(refreshToken);

    assertNotNull(response);
    assertEquals("new-access-token", response.accessToken());
  }

  @Test
  void logout_calls_keycloak_logout() {
    var refreshToken = "refresh-token";

    authUseCase.logout(refreshToken);

    Mockito.verify(keycloakFeignClient).logout(any(TokenParam.class));
  }
}

