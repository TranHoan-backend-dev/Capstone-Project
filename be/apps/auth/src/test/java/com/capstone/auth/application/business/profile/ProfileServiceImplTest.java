package com.capstone.auth.application.business.profile;

import com.capstone.common.exception.NotExistingException;
import com.capstone.auth.domain.model.Profile;
import com.capstone.auth.infrastructure.persistence.ProfileRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProfileServiceImplTest {

  @Mock
  ProfileRepository profileRepository;

  @InjectMocks
  ProfileServiceImpl profileService;

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

    var dto = profileService.getProfileByCredentials(username);

    assertNotNull(dto);
    assertEquals("Name", dto.fullname());
  }

  @Test
  void getProfileById_returns_profile_with_empty_strings_for_null_optional_fields() {
    var id = "user-123";
    var profile = new Profile(id, null, "Name", null, null, "0912345678", null, null);

    when(profileRepository.findById(id)).thenReturn(Optional.of(profile));

    var dto = profileService.getProfileById(id);

    assertEquals("", dto.avatarUrl());
    assertEquals("", dto.address());
    assertEquals("", dto.gender().toString());
    assertEquals("", dto.birthday().toString());
  }

  @Test
  void getProfileById_throws_npe_when_id_is_null() {
    assertThrows(NullPointerException.class, () -> profileService.getProfileById(null));
  }

  @Test
  void getProfileByCredentials_throws_not_existing_exception_when_email_not_found() {
    String email = "missing@example.com";
    when(profileRepository.findByUsersEmail(email)).thenReturn(Optional.empty());

    assertThrows(NotExistingException.class, () -> profileService.getProfileByCredentials(email));
  }

  @Test
  void getProfileByCredentials_throws_not_existing_exception_when_username_not_found() {
    String username = "missinguser";
    when(profileRepository.findByUsersUsername(username)).thenReturn(Optional.empty());

    assertThrows(NotExistingException.class, () -> profileService.getProfileByCredentials(username));
  }

  @Test
  void getProfileByCredentials_throws_npe_when_value_is_null() {
    assertThrows(NullPointerException.class, () -> profileService.getProfileByCredentials(null));
  }
}
