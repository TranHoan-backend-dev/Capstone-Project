package com.capstone.auth.application.usecase;

import com.capstone.auth.application.business.roles.RoleService;
import com.capstone.auth.application.business.users.UserService;
import com.capstone.auth.application.dto.request.users.NewUserRequest;
import com.capstone.auth.application.dto.request.keycloakparam.TokenExchangeParam;
import com.capstone.auth.application.dto.request.keycloakparam.UserCreationParam;
import com.capstone.auth.application.dto.response.TokenExchangeResponse;
import com.capstone.auth.application.event.producer.message.AccountCreationEvent;
import com.capstone.auth.application.event.producer.MessageProducer;
import com.capstone.auth.domain.model.Roles;
import com.capstone.auth.infrastructure.utils.Message;
import com.capstone.auth.infrastructure.service.keycloak.KeycloakFeignClient;
import com.capstone.common.enumerate.RoleName;
import com.capstone.auth.infrastructure.service.NetworkService;
import com.capstone.auth.infrastructure.service.OrganizationService;
import com.capstone.auth.application.business.profile.ProfileService;
import com.capstone.common.utils.SharedMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.UserRepresentation;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthUseCaseTest {

  @Mock
  private UserService uSrv;

  @Mock
  private RoleService rSrv;

  @Mock
  private MessageProducer template;

  @Mock
  private Keycloak keycloak;

  @Mock
  private KeycloakFeignClient keycloakFeignClient;

  @Mock
  private RealmResource realmResource;

  @Mock
  private UsersResource usersResource;

  @Mock
  private ProfileService pSrv;

  @Mock
  private NetworkService netWorkService;

  @Mock
  private OrganizationService organizationService;

  @Mock
  private Logger log;

  @InjectMocks
  private AuthUseCase authUseCase;

  private static final String REALM = "test-realm";
  private static final String CLIENT_ID = "test-client-id";
  private static final String CLIENT_SECRET = "test-client-secret";
  private static final String SUBJECT = "Welcome Subject";
  private static final String TEMPLATE = "welcome-template";
  private static final String ROUTING_KEY = "test-routing-key";

  private NewUserRequest validRequest;

  @BeforeEach
  void setUp() {
    ReflectionTestUtils.setField(authUseCase, "realm", REALM);
    ReflectionTestUtils.setField(authUseCase, "adminClientId", CLIENT_ID);
    ReflectionTestUtils.setField(authUseCase, "adminClientSecret", CLIENT_SECRET);
    ReflectionTestUtils.setField(authUseCase, "SUBJECT", SUBJECT);
    ReflectionTestUtils.setField(authUseCase, "TEMPLATE", TEMPLATE);
    ReflectionTestUtils.setField(authUseCase, "ROUTING_KEY", ROUTING_KEY);

    validRequest = new NewUserRequest(
      "testuser",
      "password123",
      "First",
      "Last",
      "test@example.com",
      "0123456789",
      RoleName.IT_STAFF.name(),
      List.of("job1", "job2"),
      "dept1",
      "wsn1");
  }

  @Test
  @DisplayName("should_RegisterUser_When_RequestIsValid")
  @SuppressWarnings("rawtypes")
  void should_RegisterUser_When_RequestIsValid() throws ExecutionException, InterruptedException {
    // Arrange
    var mockRole = new Roles();
    mockRole.setName(RoleName.IT_STAFF);
    when(rSrv.getRoleByName(RoleName.IT_STAFF)).thenReturn(mockRole);

    // Validation mocking
    when(pSrv.existsByPhone(anyString())).thenReturn(false);
    when(netWorkService.checkExistence(anyString())).thenReturn(true);
    when(organizationService.checkDepartmentExistence(anyString())).thenReturn(true);
    when(organizationService.checkJobExistence(anyString())).thenReturn(true);

    // Keycloak mocking
    when(keycloak.realm(REALM)).thenReturn(realmResource);
    when(realmResource.users()).thenReturn(usersResource);
    when(usersResource.search(validRequest.username(), true)).thenReturn(Collections.emptyList());

    var mockToken = new TokenExchangeResponse(
      "access-token", 3600L, 3600L, "refresh-token",
      "Bearer", 0, "session-state", "scope");
    when(keycloakFeignClient.exchangeToken(any(TokenExchangeParam.class))).thenReturn(mockToken);

    var headers = new HttpHeaders();
    var expectedUserId = UUID.randomUUID().toString();
    headers.add("Location", "http://keycloak/users/" + expectedUserId);
    ResponseEntity responseEntity = ResponseEntity.status(201).headers(headers).build();
    when(keycloakFeignClient.createUser(anyString(), any(UserCreationParam.class))).thenReturn(responseEntity);

    Map<String, Object> roleMap = Map.of("id", "role-id", "name", RoleName.IT_STAFF.name());
    when(keycloakFeignClient.getRealmRole(anyString(), anyString())).thenReturn(roleMap);

    // Act
    authUseCase.register(validRequest);

    // Assert
    verify(uSrv).createEmployee(
      anyString(),
      eq(validRequest.username()),
      eq(validRequest.email()),
      eq(mockRole),
      eq(validRequest.jobIds()),
      eq(validRequest.departmentId()),
      eq(validRequest.waterSupplyNetworkId()),
      eq("First Last"),
      eq(validRequest.phoneNumber()));

    verify(keycloakFeignClient).exchangeToken(argThat(param -> param.getClientId().equals(CLIENT_ID) &&
      param.getClientSecret().equals(CLIENT_SECRET) &&
      param.getGrantType().equals("client_credentials")));

    verify(keycloakFeignClient).createUser(eq("Bearer access-token"),
      argThat(param -> param.getUsername().equals(validRequest.username()) &&
        param.getEmail().equals(validRequest.email()) &&
        param.isEnabled()));

    verify(keycloakFeignClient).assignRealmRole(eq("Bearer access-token"), eq(expectedUserId), anyList());

    verify(template).sendMessage(eq(ROUTING_KEY), any(AccountCreationEvent.class));
  }

  @Test
  @DisplayName("should_ThrowException_When_UsernameIsNull")
  void should_ThrowException_When_UsernameIsNull() {
    var invalidRequest = new NewUserRequest(
      null, "pass", "First", "Last", "email", "phone", "ROLE", List.of(), "dept", "wsn");

    NullPointerException exception = assertThrows(NullPointerException.class,
      () -> authUseCase.register(invalidRequest));
    assertEquals(SharedMessage.MES_18, exception.getMessage());
  }

  @Test
  @DisplayName("should_ThrowException_When_EmailIsNull")
  void should_ThrowException_When_EmailIsNull() {
    var invalidRequest = new NewUserRequest(
      "user", "pass", "First", "Last", null, "phone", "ROLE", List.of(), "dept", "wsn");

    NullPointerException exception = assertThrows(NullPointerException.class,
      () -> authUseCase.register(invalidRequest));
    assertEquals(SharedMessage.MES_02, exception.getMessage());
  }

  @Test
  @DisplayName("should_ThrowException_When_RoleIsNull")
  void should_ThrowException_When_RoleIsNull() {
    var invalidRequest = new NewUserRequest(
      "user", "pass", "First", "Last", "email", "phone", null, List.of(), "dept", "wsn");

    NullPointerException exception = assertThrows(NullPointerException.class,
      () -> authUseCase.register(invalidRequest));
    assertEquals(Message.PT_13, exception.getMessage());
  }

  @Test
  @DisplayName("should_ThrowException_When_JobIdsIsNull")
  void should_ThrowException_When_JobIdsIsNull() {
    var invalidRequest = new NewUserRequest(
      "user", "pass", "First", "Last", "email", "phone", "ROLE", null, "dept", "wsn");

    NullPointerException exception = assertThrows(NullPointerException.class,
      () -> authUseCase.register(invalidRequest));
    assertEquals(Message.PT_12, exception.getMessage());
  }

  @Test
  @DisplayName("should_ThrowException_When_DepartmentIdIsNull")
  void should_ThrowException_When_DepartmentIdIsNull() {
    var invalidRequest = new NewUserRequest(
      "user", "pass", "First", "Last", "email", "phone", "ROLE", List.of(), null, "wsn");

    NullPointerException exception = assertThrows(NullPointerException.class,
      () -> authUseCase.register(invalidRequest));
    assertEquals(Message.PT_11, exception.getMessage());
  }

  @Test
  @DisplayName("should_ThrowException_When_WaterSupplyNetworkIdIsNull")
  void should_ThrowException_When_WaterSupplyNetworkIdIsNull() {
    var invalidRequest = new NewUserRequest(
      "user", "pass", "First", "Last", "email", "phone", "ROLE", List.of(), "dept", null);

    NullPointerException exception = assertThrows(NullPointerException.class,
      () -> authUseCase.register(invalidRequest));
    assertEquals(Message.PT_10, exception.getMessage());
  }

  @Test
  @DisplayName("should_ThrowException_When_RoleIsNotFound")
  void should_ThrowException_When_RoleIsNotFound() {
    when(rSrv.getRoleByName(any())).thenReturn(null);

    NullPointerException exception = assertThrows(NullPointerException.class,
      () -> authUseCase.register(validRequest));
    assertEquals(Message.SE_07, exception.getMessage());
  }

  @Test
  @DisplayName("should_ThrowException_When_RoleNameIsInvalid")
  void should_ThrowException_When_RoleNameIsInvalid() {
    var invalidRequest = new NewUserRequest(
      "user", "pass", "First", "Last", "email", "phone", "INVALID_ROLE", List.of(), "dept", "wsn");

    assertThrows(IllegalArgumentException.class, () -> authUseCase.register(invalidRequest));
  }

  @Test
  @DisplayName("should_ThrowException_When_KeycloakUserAlreadyExists")
  void should_ThrowException_When_KeycloakUserAlreadyExists() {
    var mockRole = new Roles();
    mockRole.setName(RoleName.IT_STAFF);
    when(rSrv.getRoleByName(RoleName.IT_STAFF)).thenReturn(mockRole);

    // Validation mocking
    when(pSrv.existsByPhone(anyString())).thenReturn(false);
    when(netWorkService.checkExistence(anyString())).thenReturn(true);
    when(organizationService.checkDepartmentExistence(anyString())).thenReturn(true);
    when(organizationService.checkJobExistence(anyString())).thenReturn(true);

    when(keycloak.realm(REALM)).thenReturn(realmResource);
    when(realmResource.users()).thenReturn(usersResource);
    when(usersResource.search(validRequest.username(), true)).thenReturn(List.of(new UserRepresentation()));

    IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
      () -> authUseCase.register(validRequest));
    assertEquals("Username already exists", exception.getMessage());
  }

  @Test
  @DisplayName("should_ThrowException_When_KeycloakLocationHeaderMissing")
  @SuppressWarnings("rawtypes")
  void should_ThrowException_When_KeycloakLocationHeaderMissing() {
    // Arrange
    var mockRole = new Roles();
    mockRole.setName(RoleName.IT_STAFF);
    when(rSrv.getRoleByName(RoleName.IT_STAFF)).thenReturn(mockRole);
    // Validation mocking
    when(pSrv.existsByPhone(anyString())).thenReturn(false);
    when(netWorkService.checkExistence(anyString())).thenReturn(true);
    when(organizationService.checkDepartmentExistence(anyString())).thenReturn(true);
    when(organizationService.checkJobExistence(anyString())).thenReturn(true);

    // Keycloak mocking
    when(keycloak.realm(REALM)).thenReturn(realmResource);
    when(realmResource.users()).thenReturn(usersResource);
    when(usersResource.search(validRequest.username(), true)).thenReturn(Collections.emptyList());

    var mockToken = new TokenExchangeResponse(
      "access-token", 3600L, 3600L, "refresh-token",
      "Bearer", 0, "session-state", "scope");
    when(keycloakFeignClient.exchangeToken(any(TokenExchangeParam.class))).thenReturn(mockToken);

    // Response without headers or location
    ResponseEntity responseEntity = ResponseEntity.status(201).build();
    when(keycloakFeignClient.createUser(anyString(), any(UserCreationParam.class))).thenReturn(responseEntity);

    // Act & Assert
    IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
      () -> authUseCase.register(validRequest));
    assertEquals("No location header found", exception.getMessage());
  }
}
