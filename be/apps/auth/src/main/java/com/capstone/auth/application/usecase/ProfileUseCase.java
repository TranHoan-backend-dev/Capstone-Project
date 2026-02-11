package com.capstone.auth.application.usecase;

import com.capstone.auth.application.business.dto.ProfileDTO;
import com.capstone.auth.application.business.dto.UserDTO;
import com.capstone.auth.application.business.profile.ProfileService;
import com.capstone.auth.application.business.users.UserService;
import com.capstone.auth.application.dto.request.UpdateProfileRequest;
import com.capstone.auth.application.dto.response.UserProfileResponse;
import com.capstone.auth.application.exception.IncompatibleAvatarException;
import com.capstone.auth.domain.model.Profile;
import com.capstone.auth.infrastructure.config.Constant;
import com.capstone.auth.infrastructure.service.GcsService;
import com.capstone.auth.infrastructure.utils.Utils;
import com.capstone.auth.infrastructure.utils.IdEncoder;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.keycloak.admin.client.Keycloak;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.DisabledException;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProfileUseCase {
  UserService uSrv;
  ProfileService pSrv;
  Keycloak keycloak;
  GcsService gcsSrv;

  @Value("${keycloak.realms}")
  @NonFinal
  String realm;

  public UserProfileResponse getMe(String id, String email, String username) {
    log.info("Check status and get profile by id: {}", id);
    var user = getNonLockedUserById(id);

    Utils.validateCredentials(user, email, username);

    var profile = pSrv.getProfileById(id);

    return returnUserProfile(profile, user);
  }

  public UserProfileResponse updateProfile(String id, @NonNull UpdateProfileRequest request) {
    log.info("Updating profile by id: {}", id);
    log.info("Request: {}", request);
    var user = getNonLockedUserById(id);
    var profile = pSrv.getProfileById(id);

    var newProfile = new Profile();

    log.info("FullName: {}", request.fullName());
    if (request.fullName() != null) {
      var regexMatch = request.fullName().matches("^[\\p{L} ]+$");
      log.info("FullName regexMatch: {}", regexMatch);
      if (regexMatch) {
        newProfile.setFullname(request.fullName());
      } else {
        throw new IllegalArgumentException("Fullname can not contain digits and special characters");
      }
    } else {
      newProfile.setFullname(profile.fullname());
    }

    if (request.username() != null &&
      !request.username().isEmpty() &&
      !request.username().isBlank() &&
      !request.username().equalsIgnoreCase(user.username())) {
      // update information on keycloak
      updateOnKeycloak(id, request.username());
      user = uSrv.updateUsername(id, request.username());
    }

    if (request.phoneNumber() != null &&
      !request.phoneNumber().isEmpty() &&
      !request.phoneNumber().isBlank() &&
      !request.phoneNumber().equalsIgnoreCase(profile.phoneNumber())) {
      if (!request.phoneNumber().matches(Constant.PHONE_PATTERN)) {
        throw new IllegalArgumentException(Constant.PT_14);
      }
      if (!request.phoneNumber().equals(profile.phoneNumber())) {
        newProfile.setPhoneNumber(request.phoneNumber());
      } else {
        newProfile.setPhoneNumber(profile.phoneNumber());
      }
    } else {
      newProfile.setPhoneNumber(profile.phoneNumber());
    }

    if (request.birthdate() != null &&
      !request.birthdate().isEmpty() &&
      !request.birthdate().isBlank()) {
      if (!Utils.isLocalDate(request.birthdate(), DateTimeFormatter.ISO_LOCAL_DATE)) {
        throw new IllegalArgumentException(Constant.PT_25);
      }
      newProfile.setBirthday(
        LocalDate.parse(request.birthdate(), DateTimeFormatter.ISO_LOCAL_DATE));
    } else {
      newProfile.setBirthday(profile.birthday());
    }

    newProfile.setAddress((request.address() != null &&
      !request.address().isEmpty() &&
      !request.address().isBlank() &&
      !request.address().equalsIgnoreCase(profile.address())) ? request.address() : profile.address());

    newProfile.setGender(request.gender() != null ? request.gender() : profile.gender());
    newProfile.setProfileId(IdEncoder.decode(profile.id()));

    return returnUserProfile(pSrv.updateProfile(newProfile), user);
  }

  public UserProfileResponse updateAvatar(String id, MultipartFile file) {
    log.info("Update avatar");
    var user = getNonLockedUserById(id);

    // tải lên GCS
    var avatarUrl = gcsSrv.upload(file);

    var profile = pSrv.updateAvatar(id, avatarUrl);
    if (!avatarUrl.equals(profile.avatarUrl())) {
      throw new IncompatibleAvatarException();
    }
    return returnUserProfile(profile, user);
  }

  private @NonNull UserDTO getNonLockedUserById(String id) {
    var user = uSrv.getUserById(id);

    if (user.isLocked()) {
      throw new DisabledException(Constant.SE_07);
    }
    return user;
  }

  private void updateOnKeycloak(String id, String username) {
    log.info("Updating username on keycloak for user id: {}", id);

    var realmResource = keycloak.realm(realm);
    var userResource = realmResource.users().get(id);

    // Verify user exists in Keycloak first
    var user = userResource.toRepresentation();
    if (user == null) {
      log.error("User with id {} not found in Keycloak", id);
      throw new IllegalArgumentException("User not found in Keycloak");
    }
    log.info("Found user in Keycloak: id={}, username={}, email={}", user.getId(), user.getUsername(), user.getEmail());

    // check trung username
    var users = realmResource.users().search(username, true);
    if (!users.isEmpty() && users.stream().noneMatch(u -> u.getId().equals(id))) {
      throw new IllegalArgumentException("Username already exists");
    }

    user.setUsername(username);
    log.info("Attempting to update username to: {}", username);

    try {
      userResource.update(user);
      log.info("Successfully updated username on Keycloak");
    } catch (jakarta.ws.rs.BadRequestException e) {
      log.error("Keycloak BadRequest error: {}", e.getMessage());
      var response = e.getResponse();
      if (response != null) {
        log.error("Keycloak response status: {}", response.getStatus());
        var entity = response.readEntity(String.class);
        log.error("Keycloak response body: {}", entity);
      }
      throw new IllegalArgumentException("Failed to update username on Keycloak: " + e.getMessage(), e);
    }
  }

  private UserProfileResponse returnUserProfile(@NonNull ProfileDTO profile, @NonNull UserDTO user) {
    return new UserProfileResponse(
      profile.fullname(),
      profile.avatarUrl(),
      profile.address(),
      profile.phoneNumber(),
      profile.gender() == null ? null : profile.gender().toString(),
      profile.birthday() == null ? null : profile.birthday().toString(),
      user.role().toLowerCase(),
      user.username(),
      user.email());
  }
}
