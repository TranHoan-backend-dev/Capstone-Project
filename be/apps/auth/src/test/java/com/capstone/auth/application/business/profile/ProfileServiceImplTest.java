package com.capstone.auth.application.business.profile;

import com.capstone.auth.application.dto.response.FullNamesResponse;
import com.capstone.common.exception.NotExistingException;
import com.capstone.auth.domain.model.Profile;
import com.capstone.auth.infrastructure.persistence.ProfileRepository;
import com.capstone.auth.infrastructure.service.keycloak.KeycloakService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProfileServiceImplTest {

  @Mock
  ProfileRepository profileRepository;

  @Mock
  KeycloakService keycloakService;

  @Mock
  Logger log;

  @InjectMocks
  ProfileServiceImpl profileService;

  @BeforeEach
  void setUp() {
    ReflectionTestUtils.setField(profileService, "log", log);
  }

  @Test
  void getProfileById_returns_profile_dto_when_exists() {
    var id = "4f321e7e-3a04-4afa-82e5-4e54e005febe";
    var profile = new Profile(
      id,
      null,
      "Nguyen Van A",
      "avatar.png",
      "Hanoi",
      "0912345678",
      true,
      LocalDate.of(1990, 1, 1));

    when(profileRepository.findById(id)).thenReturn(Optional.of(profile));
    when(keycloakService.getFullName(id)).thenReturn(new FullNamesResponse("Van A", "Nguyen"));

    var dto = profileService.getProfileById(id);

    assertNotNull(dto);
    assertEquals(id, dto.id());
    assertEquals("Nguyen Van A", dto.fullname());
    assertEquals("avatar.png", dto.avatarUrl());
    assertEquals("Hanoi", dto.address());
    assertEquals("0912345678", dto.phoneNumber());
    assertEquals(true, dto.gender());
    assertEquals("1990-01-01", dto.birthday().toString());
  }

  @Test
  void getProfileById_throws_not_existing_exception_when_not_found() {
    var id = "14c5879c-a6c4-45a6-846b-39d2b9d8c961";
    when(profileRepository.findById(id)).thenReturn(Optional.empty());

    assertThrows(NotExistingException.class, () -> profileService.getProfileById(id));
  }

  @Test
  void getProfileByCredentials_calls_repo_by_email_when_email_pattern_matches() {
    var email = "test@example.com";
    var profile = new Profile(
      "id-1",
      null,
      "Name",
      null,
      null,
      "0912345678",
      true,
      null);

    when(profileRepository.findByUsersEmail(email)).thenReturn(Optional.of(profile));
    when(keycloakService.getFullName("id-1")).thenReturn(new FullNamesResponse("Name", ""));

    var dto = profileService.getProfileByCredentials(email);

    assertNotNull(dto);
    assertEquals("Name", dto.fullname());
  }

  @Test
  void getProfileByCredentials_calls_repo_by_username_when_not_email() {
    var username = "testuser";
    var profile = new Profile(
      "id-1",
      null,
      "Name",
      null,
      null,
      "0912345678",
      true,
      null);

    when(profileRepository.findByUsersUsername(username)).thenReturn(Optional.of(profile));
    when(keycloakService.getFullName("id-1")).thenReturn(new FullNamesResponse("Name", ""));

    var dto = profileService.getProfileByCredentials(username);

    assertNotNull(dto);
    assertEquals("Name", dto.fullname());
  }

  @Test
  void getProfileById_returns_profile_with_null_for_null_optional_fields() {
    var id = "user-123";
    var profile = new Profile(id, null, "Name", null, null, "0912345678", null, null);

    when(profileRepository.findById(id)).thenReturn(Optional.of(profile));
    when(keycloakService.getFullName(id)).thenReturn(new FullNamesResponse("Name", ""));

    var dto = profileService.getProfileById(id);

    assertNull(dto.avatarUrl());
    assertNull(dto.address());
    assertNull(dto.gender());
    assertNull(dto.birthday());
  }

  @Test
  void getProfileById_throws_npe_when_id_is_null() {
    assertThrows(NullPointerException.class, () -> profileService.getProfileById(null));
  }

  @Test
  void getProfileByCredentials_throws_not_existing_exception_when_email_not_found() {
    var email = "missing@example.com";
    when(profileRepository.findByUsersEmail(email)).thenReturn(Optional.empty());

    assertThrows(NotExistingException.class, () -> profileService.getProfileByCredentials(email));
  }

  @Test
  void getProfileByCredentials_throws_not_existing_exception_when_username_not_found() {
    var username = "missinguser";
    when(profileRepository.findByUsersUsername(username)).thenReturn(Optional.empty());

    assertThrows(NotExistingException.class, () -> profileService.getProfileByCredentials(username));
  }

  @Test
  void getProfileByCredentials_throws_npe_when_value_is_null() {
    assertThrows(NullPointerException.class, () -> profileService.getProfileByCredentials(null));
  }

  @Test
  void updateProfile_success() {
    var id = "user-1";
    var profile = new Profile();
    profile.setProfileId(id);
    profile.setFullname("New Name");

    when(keycloakService.getFullName(id)).thenReturn(new FullNamesResponse("New Name", ""));

    var result = profileService.updateProfile(profile);

    assertNotNull(result);
    assertEquals("New Name", result.fullname());
    verify(keycloakService).updateUserNames(id, "New Name");
    verify(profileRepository).save(profile);
  }

  @Test
  void existsByPhone_returns_true_when_exists() {
    when(profileRepository.existsByPhoneNumber("091")).thenReturn(true);
    assertTrue(profileService.existsByPhone("091"));
  }

  @Test
  void getAvatar_returns_url() {
    when(profileRepository.findAvatarUrlByProfileId("id")).thenReturn("url");
    assertEquals("url", profileService.getAvatar("id"));
  }

  @Test
  void getFullName_returns_correct_name() {
    when(keycloakService.getFullName("id")).thenReturn(new FullNamesResponse("First", "Last"));
    assertEquals("First Last", profileService.getFullName("id"));
  }
}
