package com.capstone.auth.application.business.profile;

import com.capstone.common.exception.NotExistingException;
import com.capstone.auth.domain.model.Profile;
import com.capstone.auth.infrastructure.persistence.ProfileRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProfileServiceImplUpdateAvatarTest {

  @Mock
  ProfileRepository profileRepository;

  @InjectMocks
  ProfileServiceImpl profileService;

  @Mock
  private Logger log;

  @org.junit.jupiter.api.BeforeEach
  void setUp() {
    org.springframework.test.util.ReflectionTestUtils.setField(profileService, "log", log);
  }

  @Test
  void updateAvatar_returns_updated_profile_dto_when_successful() {
    var id = "4f321e7e-3a04-4afa-82e5-4e54e005febe";
    var avatarUrl = "https://storage.googleapis.com/bucket/avatar.png";
    var profile = new Profile(
      id,
      null,
      "Nguyen Van A",
      avatarUrl,
      "Hanoi",
      "0912345678",
      true,
      LocalDate.of(1990, 1, 1));

    doNothing().when(profileRepository).updateAvatarByProfileId(id, avatarUrl);
    when(profileRepository.findById(id)).thenReturn(Optional.of(profile));

    var dto = profileService.updateAvatar(id, avatarUrl);

    assertNotNull(dto);
    assertEquals(id, dto.id());
    assertEquals("Nguyen Van A", dto.fullname());
    assertEquals(avatarUrl, dto.avatarUrl());
    assertEquals("Hanoi", dto.address());
    assertEquals("0912345678", dto.phoneNumber());
    assertEquals(true, dto.gender());
    assertEquals(LocalDate.of(1990, 1, 1), dto.birthday());

    verify(profileRepository).updateAvatarByProfileId(id, avatarUrl);
    verify(profileRepository).findById(id);
  }

  @Test
  void updateAvatar_throws_not_existing_exception_when_profile_not_found() {
    var id = "non-existing-profile";
    var avatarUrl = "https://storage.googleapis.com/bucket/avatar.png";

    doNothing().when(profileRepository).updateAvatarByProfileId(id, avatarUrl);
    when(profileRepository.findById(id)).thenReturn(Optional.empty());

    assertThrows(NotExistingException.class,
      () -> profileService.updateAvatar(id, avatarUrl));

    verify(profileRepository).updateAvatarByProfileId(id, avatarUrl);
    verify(profileRepository).findById(id);
  }

  @Test
  void updateAvatar_with_null_avatar_url() {
    var id = "4f321e7e-3a04-4afa-82e5-4e54e005febe";
    String avatarUrl = null;
    var profile = new Profile(
      id,
      null,
      "Nguyen Van A",
      null,
      "Hanoi",
      "0912345678",
      true,
      LocalDate.of(1990, 1, 1));

    doNothing().when(profileRepository).updateAvatarByProfileId(id, avatarUrl);
    when(profileRepository.findById(id)).thenReturn(Optional.of(profile));

    var dto = profileService.updateAvatar(id, avatarUrl);

    assertNotNull(dto);
    assertNull(dto.avatarUrl());

    verify(profileRepository).updateAvatarByProfileId(id, avatarUrl);
  }

  @Test
  void updateAvatar_with_empty_avatar_url() {
    var id = "4f321e7e-3a04-4afa-82e5-4e54e005febe";
    var avatarUrl = "";
    var profile = new Profile(
      id,
      null,
      "Nguyen Van A",
      "",
      "Hanoi",
      "0912345678",
      true,
      LocalDate.of(1990, 1, 1));

    doNothing().when(profileRepository).updateAvatarByProfileId(id, avatarUrl);
    when(profileRepository.findById(id)).thenReturn(Optional.of(profile));

    var dto = profileService.updateAvatar(id, avatarUrl);

    assertNotNull(dto);
    assertEquals("", dto.avatarUrl());
  }

  @Test
  void updateAvatar_verifies_repository_call_order() {
    var id = "user-123";
    var avatarUrl = "new-avatar.png";
    var profile = new Profile(id, null, "Name", avatarUrl, null, "0912345678", true, null);

    doNothing().when(profileRepository).updateAvatarByProfileId(id, avatarUrl);
    when(profileRepository.findById(id)).thenReturn(Optional.of(profile));

    profileService.updateAvatar(id, avatarUrl);

    var inOrder = inOrder(profileRepository);
    inOrder.verify(profileRepository).updateAvatarByProfileId(id, avatarUrl);
    inOrder.verify(profileRepository).findById(id);
  }

  @Test
  void updateAvatar_returns_profile_with_null_optional_fields() {
    var id = "user-123";
    var avatarUrl = "avatar.png";
    var profile = new Profile(id, null, "Name", avatarUrl, null, "0912345678", null, null);

    doNothing().when(profileRepository).updateAvatarByProfileId(id, avatarUrl);
    when(profileRepository.findById(id)).thenReturn(Optional.of(profile));

    var dto = profileService.updateAvatar(id, avatarUrl);

    assertNotNull(dto);
    assertEquals(avatarUrl, dto.avatarUrl());
    assertNull(dto.address());
    assertNull(dto.gender());
    assertNull(dto.birthday());
  }

  @Test
  void updateAvatar_with_special_characters_in_avatar_url() {
    var id = "user-123";
    var avatarUrl = "https://storage.googleapis.com/bucket/users/id%20with%20spaces/avatar.png?token=abc123&size=large";
    var profile = new Profile(id, null, "Name", avatarUrl, null, "0912345678", true, null);

    doNothing().when(profileRepository).updateAvatarByProfileId(id, avatarUrl);
    when(profileRepository.findById(id)).thenReturn(Optional.of(profile));

    var dto = profileService.updateAvatar(id, avatarUrl);

    assertNotNull(dto);
    assertEquals(avatarUrl, dto.avatarUrl());
  }

  @Test
  void updateAvatar_with_long_avatar_url() {
    var id = "user-123";
    var avatarUrl = "https://storage.googleapis.com/bucket/" + "a".repeat(500) + "/avatar.png";
    var profile = new Profile(id, null, "Name", avatarUrl, null, "0912345678", true, null);

    doNothing().when(profileRepository).updateAvatarByProfileId(id, avatarUrl);
    when(profileRepository.findById(id)).thenReturn(Optional.of(profile));

    var dto = profileService.updateAvatar(id, avatarUrl);

    assertNotNull(dto);
    assertEquals(avatarUrl, dto.avatarUrl());
  }

  @Test
  void updateAvatar_returns_encoded_id() {
    var rawId = "4f321e7e-3a04-4afa-82e5-4e54e005febe";
    var avatarUrl = "avatar.png";
    var profile = new Profile(rawId, null, "Name", avatarUrl, null, "0912345678", true, null);

    doNothing().when(profileRepository).updateAvatarByProfileId(rawId, avatarUrl);
    when(profileRepository.findById(rawId)).thenReturn(Optional.of(profile));

    var dto = profileService.updateAvatar(rawId, avatarUrl);

    assertNotNull(dto);
    assertEquals(rawId, dto.id());
  }

  @Test
  void updateAvatar_returns_all_profile_fields_correctly() {
    var id = "user-full";
    var avatarUrl = "https://example.com/full-avatar.jpg";
    var profile = new Profile(
      id,
      null,
      "Complete User",
      avatarUrl,
      "123 Full Address, City",
      "0987654321",
      false,
      LocalDate.of(2000, 6, 15));

    doNothing().when(profileRepository).updateAvatarByProfileId(id, avatarUrl);
    when(profileRepository.findById(id)).thenReturn(Optional.of(profile));

    var dto = profileService.updateAvatar(id, avatarUrl);

    assertNotNull(dto);
    assertEquals(id, dto.id());
    assertEquals("Complete User", dto.fullname());
    assertEquals(avatarUrl, dto.avatarUrl());
    assertEquals("123 Full Address, City", dto.address());
    assertEquals("0987654321", dto.phoneNumber());
    assertEquals(false, dto.gender());
    assertEquals(LocalDate.of(2000, 6, 15), dto.birthday());
  }

  @Test
  void updateAvatar_with_different_image_formats() {
    var id = "user-123";

    // Test with different image format URLs
    var jpegUrl = "https://storage.com/avatar.jpeg";

    var profile = new Profile(id, null, "Name", jpegUrl, null, "0912345678", true, null);

    doNothing().when(profileRepository).updateAvatarByProfileId(id, jpegUrl);
    when(profileRepository.findById(id)).thenReturn(Optional.of(profile));

    var dto = profileService.updateAvatar(id, jpegUrl);
    assertEquals(jpegUrl, dto.avatarUrl());
  }

  @Test
  void updateAvatar_repository_interaction_count() {
    var id = "user-123";
    var avatarUrl = "avatar.png";
    var profile = new Profile(id, null, "Name", avatarUrl, null, "0912345678", true, null);

    doNothing().when(profileRepository).updateAvatarByProfileId(id, avatarUrl);
    when(profileRepository.findById(id)).thenReturn(Optional.of(profile));

    profileService.updateAvatar(id, avatarUrl);

    verify(profileRepository, times(1)).updateAvatarByProfileId(id, avatarUrl);
    verify(profileRepository, times(1)).findById(id);
    verifyNoMoreInteractions(profileRepository);
  }
}
