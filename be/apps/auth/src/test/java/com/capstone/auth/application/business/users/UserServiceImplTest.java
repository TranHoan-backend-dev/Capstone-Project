package com.capstone.auth.application.business.users;

import com.capstone.auth.application.dto.request.FilterUsersRequest;
import com.capstone.auth.application.dto.response.EmployeeResponse;
import com.capstone.auth.application.exception.ExistingException;
import com.capstone.auth.application.exception.NotExistingException;
import com.capstone.auth.domain.model.EmployeeJob;
import com.capstone.auth.domain.model.Profile;
import com.capstone.auth.domain.model.Roles;
import com.capstone.auth.domain.model.Users;
import com.capstone.auth.domain.enumerate.RoleName;
import com.capstone.auth.infrastructure.persistence.BusinessPagesOfEmployeeRepository;
import com.capstone.auth.infrastructure.persistence.EmployeeJobRepository;
import com.capstone.auth.infrastructure.persistence.ProfileRepository;
import com.capstone.auth.infrastructure.persistence.UserRepository;
import com.capstone.auth.infrastructure.service.NetworkService;
import com.capstone.auth.infrastructure.service.OrganizationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

  @Mock
  private UserRepository repo;

  @Mock
  private BusinessPagesOfEmployeeRepository bpRepo;

  @Mock
  private ProfileRepository profileRepo;

  @Mock
  private EmployeeJobRepository employeeJobRepo;

  @Mock
  private NetworkService netWorkService;

  @Mock
  private OrganizationService organizationService;

  @Mock
  private Logger log;

  @InjectMocks
  private UserServiceImpl userService;

  @BeforeEach
  void setUp() {
    ReflectionTestUtils.setField(userService, "log", log);
  }

  @Test
  @DisplayName("should_CreateEmployee_When_InputIsValid")
  void should_CreateEmployee_When_InputIsValid() {
    // Arrange
    var username = "testuser";
    var email = "test@example.com";
    var role = new Roles();
    role.setName(RoleName.IT_STAFF);
    List<String> jobIds = List.of("job1");
    var departmentId = "dept1";
    var waterSupplyNetworkId = "wsn1";
    var fullName = "Full Name";
    var phone = "0123456789";

    when(repo.findByEmail(email)).thenReturn(Optional.empty());
    when(profileRepo.existsByPhoneNumber(phone)).thenReturn(false);
    when(netWorkService.checkExistence(waterSupplyNetworkId)).thenReturn(true);
    when(organizationService.checkDepartmentExistence(departmentId)).thenReturn(true);
    when(organizationService.checkJobExistence("job1")).thenReturn(true);

    var mockUser = new Users();
    mockUser.setUserId("user-id");
    when(repo.save(any(Users.class))).thenReturn(mockUser);
    when(profileRepo.save(any(Profile.class))).thenReturn(new Profile());
    when(employeeJobRepo.save(any(EmployeeJob.class))).thenReturn(new EmployeeJob());

    // Act
    userService.createEmployee(username, email, role, jobIds, departmentId, waterSupplyNetworkId, fullName, phone);

    // Assert
    verify(repo).save(argThat(u -> u.getEmail().equals(email) &&
      u.getUsername().equals(username) &&
      u.getRole().equals(role) &&
      u.getDepartmentId().equals(departmentId) &&
      u.getWaterSupplyNetworkId().equals(waterSupplyNetworkId)));
    verify(profileRepo).save(any(Profile.class));
    verify(employeeJobRepo).save(any(EmployeeJob.class));
  }

  @Test
  @DisplayName("should_ThrowExistingException_When_EmailExists")
  void should_ThrowExistingException_When_EmailExists() {
    var email = "test@example.com";
    when(repo.findByEmail(email)).thenReturn(Optional.of(new Users()));

    assertThrows(ExistingException.class,
      () -> userService.createEmployee("u", email, new Roles(), List.of(), "d", "w", "n", "p"));
  }

  @Test
  @DisplayName("should_ThrowExistingException_When_PhoneExists")
  void should_ThrowExistingException_When_PhoneExists() {
    var phone = "0123456789";
    when(repo.findByEmail(anyString())).thenReturn(Optional.empty());
    when(profileRepo.existsByPhoneNumber(phone)).thenReturn(true);

    assertThrows(ExistingException.class,
      () -> userService.createEmployee("u", "e@e.com", new Roles(), List.of(), "d", "w", "n", phone));
  }

  @Test
  @DisplayName("should_ThrowNotExistingException_When_NetworkIdNotExists")
  void should_ThrowNotExistingException_When_NetworkIdNotExists() {
    var networkId = "wsn1";
    when(repo.findByEmail(anyString())).thenReturn(Optional.empty());
    when(profileRepo.existsByPhoneNumber(anyString())).thenReturn(false);
    when(netWorkService.checkExistence(networkId)).thenReturn(false);

    assertThrows(NotExistingException.class,
      () -> userService.createEmployee("u", "e@e.com", new Roles(), List.of(), "d", networkId, "n", "p"));
  }

  @Test
  @DisplayName("should_ThrowNotExistingException_When_DepartmentIdNotExists")
  void should_ThrowNotExistingException_When_DepartmentIdNotExists() {
    var deptId = "dept1";
    when(repo.findByEmail(anyString())).thenReturn(Optional.empty());
    when(profileRepo.existsByPhoneNumber(anyString())).thenReturn(false);
    when(netWorkService.checkExistence(anyString())).thenReturn(true);
    when(organizationService.checkDepartmentExistence(deptId)).thenReturn(false);

    assertThrows(NotExistingException.class,
      () -> userService.createEmployee("u", "e@e.com", new Roles(), List.of(), deptId, "w", "n", "p"));
  }

  @Test
  @DisplayName("should_ThrowNotExistingException_When_JobIdNotExists")
  void should_ThrowNotExistingException_When_JobIdNotExists() {
    List<String> jobs = List.of("job1");
    when(repo.findByEmail(anyString())).thenReturn(Optional.empty());
    when(profileRepo.existsByPhoneNumber(anyString())).thenReturn(false);
    when(netWorkService.checkExistence(anyString())).thenReturn(true);
    when(organizationService.checkDepartmentExistence(anyString())).thenReturn(true);
    when(organizationService.checkJobExistence("job1")).thenReturn(false);

    assertThrows(NotExistingException.class,
      () -> userService.createEmployee("u", "e@e.com", new Roles(), jobs, "d", "w", "n", "p"));
  }

  @Test
  @DisplayName("should_CheckExistence_When_ValueIsEmail")
  void should_CheckExistence_When_ValueIsEmail() {
    var email = "test@example.com";
    when(repo.existsByEmail(email)).thenReturn(true);

    assertTrue(userService.checkExistence(email));
    verify(repo).existsByEmail(email);
    verify(repo, never()).existsByUsername(anyString());
  }

  @Test
  @DisplayName("should_CheckExistence_When_ValueIsUsername")
  void should_CheckExistence_When_ValueIsUsername() {
    var username = "testuser";
    when(repo.existsByUsername(username)).thenReturn(true);

    assertTrue(userService.checkExistence(username));
    verify(repo).existsByUsername(username);
    verify(repo, never()).existsByEmail(anyString());
  }

  @Test
  @DisplayName("should_ThrowNullPointerException_When_CheckExistenceInputIsNull")
  void should_ThrowNullPointerException_When_CheckExistenceInputIsNull() {
    assertThrows(NullPointerException.class, () -> userService.checkExistence(null));
  }

  @Test
  @DisplayName("should_GetUserById_When_UserExists")
  void should_GetUserById_When_UserExists() {
    var userId = "user-id";
    var user = new Users();
    user.setUserId(userId);
    user.setUsername("u");
    user.setEmail("e");
    user.setDepartmentId("d");
    user.setWaterSupplyNetworkId("w");
    user.setIsEnabled(true);
    user.setIsLocked(false);

    var role = new Roles();
    role.setName(RoleName.IT_STAFF);
    user.setRole(role);

    when(repo.findById(userId)).thenReturn(Optional.of(user));
    when(bpRepo.findPagesOfEmployeesByUsersUserId(userId)).thenReturn(Collections.emptyList());

    var result = userService.getUserById(userId);

    assertNotNull(result);
    assertEquals(userId, result.userId());
  }

  @Test
  @DisplayName("should_ThrowNotExistingException_When_GetUserByIdNotFound")
  void should_ThrowNotExistingException_When_GetUserByIdNotFound() {
    var userId = "user-id";
    when(repo.findById(userId)).thenReturn(Optional.empty());

    assertThrows(NotExistingException.class, () -> userService.getUserById(userId));
  }

  @Test
  @DisplayName("should_UpdateUsername_When_UserExists")
  void should_UpdateUsername_When_UserExists() {
    var userId = "user-id";
    var newUsername = "new-user";
    var user = new Users();
    user.setUserId(userId);
    user.setUsername("old-user");
    user.setEmail("e");
    user.setDepartmentId("d");
    user.setWaterSupplyNetworkId("w");
    user.setIsEnabled(true);
    user.setIsLocked(false);

    var role = new Roles();
    role.setName(RoleName.IT_STAFF);
    user.setRole(role);

    when(repo.findById(userId)).thenReturn(Optional.of(user));
    when(bpRepo.findPagesOfEmployeesByUsersUserId(userId)).thenReturn(Collections.emptyList());

    var result = userService.updateUsername(userId, newUsername);

    assertEquals(newUsername, result.username());
    verify(repo).save(user);
  }

  @Test
  @DisplayName("should_ThrowIllegalArgumentException_When_UpdateUsernameUserNotFound")
  void should_ThrowIllegalArgumentException_When_UpdateUsernameUserNotFound() {
    var userId = "user-id";
    when(repo.findById(userId)).thenReturn(Optional.empty());

    assertThrows(IllegalArgumentException.class, () -> userService.updateUsername(userId, "new"));
  }

  @Test
  @DisplayName("should_GetAllEmployeesWithStatus_When_RequestHasNoStatus")
  void should_GetAllEmployeesWithStatus_When_RequestHasNoStatus() {
    var pageable = Pageable.unpaged();
    var request = new FilterUsersRequest(null, null);

    var user = new Users();
    user.setUserId("uid");
    user.setUsername("user");
    user.setEmail("email");

    Page<Users> page = new PageImpl<>(List.of(user));
    when(repo.findAll(pageable)).thenReturn(page);

    Page<EmployeeResponse> result = userService.getAllEmployeesWithStatus(pageable, request);

    assertEquals(1, result.getTotalElements());
    assertEquals("user", result.getContent().getFirst().username());
  }

  @Test
  @DisplayName("should_GetAllEmployeesWithStatus_When_RequestHasStatus")
  void should_GetAllEmployeesWithStatus_When_RequestHasStatus() {
    var pageable = Pageable.unpaged();
    var request = new FilterUsersRequest(true, null);

    when(repo.findByIsEnabledTrueAndIsLockedFalse(pageable)).thenReturn(new PageImpl<>(Collections.emptyList()));

    Page<EmployeeResponse> result = userService.getAllEmployeesWithStatus(pageable, request);

    assertEquals(0, result.getTotalElements());
    verify(repo).findByIsEnabledTrueAndIsLockedFalse(pageable);
  }

  @Test
  @DisplayName("should_UpdatePassword_ThrowException_Always")
  void should_UpdatePassword_ThrowException_Always() {
    var email = "email@test.com";
    var user = new Users();
    when(repo.findByEmail(email)).thenReturn(Optional.of(user));

    assertThrows(IllegalArgumentException.class, () -> userService.updatePassword(email, "old", "new"));
  }
}
