package com.capstone.auth.application.usecase;

import com.capstone.auth.application.business.dto.ProfileDTO;
import com.capstone.auth.application.business.dto.UserDTO;
import com.capstone.auth.application.business.profile.ProfileService;
import com.capstone.auth.application.business.users.UserService;
import com.capstone.auth.application.exception.IncompatibleAvatarException;
import com.capstone.common.exception.NotExistingException;
import com.capstone.auth.infrastructure.service.OrganizationService;
import com.capstone.auth.infrastructure.utils.Message;
import com.capstone.auth.infrastructure.service.GcsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.DisabledException;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProfileUseCaseUpdateAvatarTest {

  @Mock
  UserService userService;

  @Mock
  ProfileService profileService;

  @Mock
  GcsService gcsSrv;

  @Mock
  OrganizationService oSrv;

  @InjectMocks
  ProfileUseCase profileUseCase;

  @Mock
  private Logger log;

  @BeforeEach
  void setUp() {
    ReflectionTestUtils.setField(profileUseCase, "log", log);
  }

  @Test
  void updateAvatar_returns_profile_response_when_successful() {
    var id = "user-1";
    var file = createMockFile();
    var userDTO = createNonLockedUser();
    // Note: In current implementation, avatarUrl is hardcoded as "hehe"
    var profileDTO = createProfileDTO("hehe");

    when(userService.getUserById(id)).thenReturn(userDTO);
    when(profileService.getAvatar(id)).thenReturn("old-avatar");
    when(gcsSrv.upload(any())).thenReturn("hehe");
    when(profileService.updateAvatar(eq(id), eq("hehe"))).thenReturn(profileDTO);
    when(oSrv.getDepartmentName(any())).thenReturn("IT Dept");

    var response = profileUseCase.updateAvatar(id, file);

    assertNotNull(response);
    assertEquals("Full Name", response.fullname());
    assertEquals("hehe", response.avatarUrl());
    assertEquals("user1", response.username());
    assertEquals("user@example.com", response.email());
    assertEquals("staff", response.role());

    verify(userService).getUserById(id);
    verify(profileService).getAvatar(id);
    verify(gcsSrv).delete("old-avatar");
    verify(profileService).updateAvatar(id, "hehe");
  }

  @Test
  void updateAvatar_throws_disabled_exception_when_account_locked() {
    var id = "user-1";
    var file = createMockFile();
    var userDTO = createLockedUser();

    when(userService.getUserById(id)).thenReturn(userDTO);

    var ex = assertThrows(DisabledException.class,
      () -> profileUseCase.updateAvatar(id, file));
    assertEquals(Message.SE_07, ex.getMessage());

    verify(userService).getUserById(id);
    verify(profileService, never()).updateAvatar(anyString(), anyString());
  }

  @Test
  void updateAvatar_throws_not_existing_exception_when_user_not_found() {
    var id = "non-existing-user";
    var file = createMockFile();

    when(userService.getUserById(id)).thenThrow(new NotExistingException("User not found"));

    assertThrows(NotExistingException.class, () -> profileUseCase.updateAvatar(id, file));

    verify(userService).getUserById(id);
    verify(profileService, never()).updateAvatar(anyString(), anyString());
  }

  @Test
  void updateAvatar_throws_incompatible_avatar_exception_when_avatar_url_mismatch() {
    var id = "user-1";
    var file = createMockFile();
    var userDTO = createNonLockedUser();

    when(userService.getUserById(id)).thenReturn(userDTO);
    when(profileService.getAvatar(id)).thenReturn("old");
    when(gcsSrv.upload(any())).thenReturn("hehe");
    when(profileService.updateAvatar(eq(id), eq("hehe"))).thenThrow(new IncompatibleAvatarException());

    var ex = assertThrows(IncompatibleAvatarException.class,
      () -> profileUseCase.updateAvatar(id, file));
    assertEquals("Avatar is incompatible", ex.getMessage());

    verify(userService).getUserById(id);
    verify(profileService).updateAvatar(id, "hehe");
  }

  @Test
  void updateAvatar_with_null_file_still_processes() {
    var id = "user-1";
    MultipartFile file = null;
    var userDTO = createNonLockedUser();
    var profileDTO = createProfileDTO("hehe");

    when(userService.getUserById(id)).thenReturn(userDTO);
    when(profileService.getAvatar(id)).thenReturn("old");
    when(gcsSrv.upload(any())).thenReturn("hehe");
    when(profileService.updateAvatar(eq(id), eq("hehe"))).thenReturn(profileDTO);
    when(oSrv.getDepartmentName(any())).thenReturn("IT");

    var response = profileUseCase.updateAvatar(id, file);

    assertNotNull(response);
    assertEquals("hehe", response.avatarUrl());
  }

  @Test
  void updateAvatar_returns_correct_gender_when_not_null() {
    var id = "user-1";
    var file = createMockFile();
    var userDTO = createNonLockedUser();
    var profileDTO = new ProfileDTO("encoded-id", "Full Name", "hehe", "Address", "0912345678", true,
      LocalDate.parse("1990-01-01"));

    when(userService.getUserById(id)).thenReturn(userDTO);
    when(profileService.getAvatar(id)).thenReturn("old");
    when(gcsSrv.upload(any())).thenReturn("hehe");
    when(profileService.updateAvatar(eq(id), eq("hehe"))).thenReturn(profileDTO);
    when(oSrv.getDepartmentName(any())).thenReturn("IT");

    var response = profileUseCase.updateAvatar(id, file);

    assertNotNull(response);
    assertEquals("true", response.gender());
  }

  @Test
  void updateAvatar_returns_null_gender_when_profile_gender_is_null() {
    var id = "user-1";
    var file = createMockFile();
    var userDTO = createNonLockedUser();
    var profileDTO = new ProfileDTO("encoded-id", "Full Name", "hehe", "Address", "0912345678", null,
      LocalDate.parse("1990-01-01"));

    when(userService.getUserById(id)).thenReturn(userDTO);
    when(profileService.getAvatar(id)).thenReturn("old");
    when(gcsSrv.upload(any())).thenReturn("hehe");
    when(profileService.updateAvatar(eq(id), eq("hehe"))).thenReturn(profileDTO);
    when(oSrv.getDepartmentName(any())).thenReturn("IT");

    var response = profileUseCase.updateAvatar(id, file);

    assertNotNull(response);
    assertNull(response.gender());
  }

  @Test
  void updateAvatar_returns_null_birthday_when_profile_birthday_is_null() {
    var id = "user-1";
    var file = createMockFile();
    var userDTO = createNonLockedUser();
    var profileDTO = new ProfileDTO("encoded-id", "Full Name", "hehe", "Address", "0912345678", true, null);

    when(userService.getUserById(id)).thenReturn(userDTO);
    when(profileService.getAvatar(id)).thenReturn("old");
    when(gcsSrv.upload(any())).thenReturn("hehe");
    when(profileService.updateAvatar(eq(id), eq("hehe"))).thenReturn(profileDTO);
    when(oSrv.getDepartmentName(any())).thenReturn("IT");

    var response = profileUseCase.updateAvatar(id, file);

    assertNotNull(response);
    assertNull(response.birthday());
  }

  @Test
  void updateAvatar_returns_lowercase_role() {
    var id = "user-1";
    var file = createMockFile();
    var userDTO = new UserDTO("", "IT_DEPARTMENT_STAFF", "user1", "user@example.com", false, null, null, null, null,
      null, null, null, null, true);
    var profileDTO = createProfileDTO("hehe");

    when(userService.getUserById(id)).thenReturn(userDTO);
    when(profileService.getAvatar(id)).thenReturn("old");
    when(gcsSrv.upload(any())).thenReturn("hehe");
    when(profileService.updateAvatar(eq(id), eq("hehe"))).thenReturn(profileDTO);
    when(oSrv.getDepartmentName(any())).thenReturn("IT");

    var response = profileUseCase.updateAvatar(id, file);

    assertNotNull(response);
    assertEquals("it_department_staff", response.role());
  }

  @Test
  void updateAvatar_verifies_service_interaction_order() {
    var id = "user-1";
    var file = createMockFile();
    var userDTO = createNonLockedUser();
    var profileDTO = createProfileDTO("hehe");

    when(userService.getUserById(id)).thenReturn(userDTO);
    when(profileService.getAvatar(id)).thenReturn("old");
    when(gcsSrv.upload(any())).thenReturn("hehe");
    when(profileService.updateAvatar(eq(id), eq("hehe"))).thenReturn(profileDTO);
    when(oSrv.getDepartmentName(any())).thenReturn("IT");

    profileUseCase.updateAvatar(id, file);

    var inOrder = inOrder(userService, profileService, gcsSrv);
    inOrder.verify(userService).getUserById(id);
    inOrder.verify(profileService).getAvatar(id);
    inOrder.verify(gcsSrv).delete("old");
    inOrder.verify(gcsSrv).upload(any());
    inOrder.verify(profileService).updateAvatar(id, "hehe");
  }

  @Test
  void updateAvatar_returns_correct_birthday_format() {
    var id = "user-1";
    var file = createMockFile();
    var userDTO = createNonLockedUser();
    var profileDTO = new ProfileDTO("encoded-id", "Full Name", "hehe", "Address", "0912345678", true,
      LocalDate.of(1995, 12, 25));

    when(userService.getUserById(id)).thenReturn(userDTO);
    when(profileService.getAvatar(id)).thenReturn("old");
    when(gcsSrv.upload(any())).thenReturn("hehe");
    when(profileService.updateAvatar(eq(id), eq("hehe"))).thenReturn(profileDTO);
    when(oSrv.getDepartmentName(any())).thenReturn("IT");

    var response = profileUseCase.updateAvatar(id, file);

    assertEquals("1995-12-25", response.birthday());
  }

  @Test
  void updateAvatar_returns_all_profile_fields_correctly() {
    var id = "user-1";
    var file = createMockFile();
    var userDTO = new UserDTO("", "ADMIN", "adminuser", "admin@example.com", false, null, null, null, null, null,
      null, null, null, true);
    var profileDTO = new ProfileDTO("encoded-id", "Admin User", "hehe", "Admin Address", "0987654321", false,
      LocalDate.of(1985, 5, 15));

    when(userService.getUserById(id)).thenReturn(userDTO);
    when(profileService.getAvatar(id)).thenReturn("old");
    when(gcsSrv.upload(any())).thenReturn("hehe");
    when(profileService.updateAvatar(eq(id), eq("hehe"))).thenReturn(profileDTO);
    when(oSrv.getDepartmentName(any())).thenReturn("IT");

    var response = profileUseCase.updateAvatar(id, file);

    assertNotNull(response);
    assertEquals("Admin User", response.fullname());
    assertEquals("hehe", response.avatarUrl());
    assertEquals("Admin Address", response.address());
    assertEquals("0987654321", response.phoneNumber());
    assertEquals("false", response.gender());
    assertEquals("1985-05-15", response.birthday());
    assertEquals("admin", response.role());
    assertEquals("adminuser", response.username());
    assertEquals("admin@example.com", response.email());
  }

  private UserDTO createNonLockedUser() {
    return new UserDTO("", "STAFF", "user1", "user@example.com", false, null, null, null, null, null, null, null,
      null, true);
  }

  private UserDTO createLockedUser() {
    return new UserDTO("", "STAFF", "user1", "user@example.com", true, null, null, null, null, null, null, null,
      null, true);
  }

  private ProfileDTO createProfileDTO(String avatarUrl) {
    return new ProfileDTO("encoded-id", "Full Name", avatarUrl, "Address", "0912345678", true,
      LocalDate.parse("1990-01-01"));
  }

  private MultipartFile createMockFile() {
    return new MockMultipartFile(
      "avatar",
      "avatar.png",
      "image/png",
      "test file content".getBytes());
  }
}
