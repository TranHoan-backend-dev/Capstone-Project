package com.capstone.auth.application.usecase;

import com.capstone.auth.application.business.dto.ProfileDTO;
import com.capstone.auth.application.business.dto.UserDTO;
import com.capstone.auth.application.business.profile.ProfileService;
import com.capstone.auth.application.business.users.UserService;
import com.capstone.auth.application.dto.request.UpdateProfileRequest;
import com.capstone.auth.application.dto.response.UserProfileResponse;
import com.capstone.auth.domain.model.Profile;
import com.capstone.auth.infrastructure.config.Constant;
import com.capstone.auth.infrastructure.utils.CredentialsUtils;
import com.capstone.auth.infrastructure.utils.DateUtils;
import com.capstone.auth.infrastructure.utils.IdEncoder;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.security.authentication.DisabledException;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProfileUseCase {
  UserService uSrv;
  ProfileService pSrv;

  public UserProfileResponse getMe(String id, String email, String username) {
    log.info("Check status and get profile by id: {}", id);
    var user = getUserNonLockedById(id);

    CredentialsUtils.validateCredentials(user, email, username);

    var profile = pSrv.getProfileById(id);

    return returnUserProfile(profile, user);
  }

  public UserProfileResponse updateProfile(String id, @NonNull UpdateProfileRequest request) {
    log.info("Updating profile by id: {}", id);
    var user = getUserNonLockedById(id);
    var profile = pSrv.getProfileById(id);

    var newProfile = new Profile();

    newProfile.setFullname((request.fullName() != null &&
      !request.fullName().isEmpty() &&
      !request.fullName().isBlank() &&
      !request.fullName().equalsIgnoreCase(profile.fullname()) &&
      request.fullName().matches("^[a-zA-Z ]+$")) ?
      request.fullName() : profile.fullname());

    if (request.username() != null &&
      !request.username().isEmpty() &&
      !request.username().isBlank() &&
      !request.username().equalsIgnoreCase(user.username())) {
      user = uSrv.updateUsername(id, request.username());
    }

    newProfile.setPhoneNumber((request.phoneNumber() != null &&
      !request.phoneNumber().isEmpty() &&
      !request.phoneNumber().isBlank() &&
      !request.phoneNumber().equalsIgnoreCase(profile.phoneNumber()) &&
      request.phoneNumber().matches(Constant.PHONE_PATTERN)) ?
      request.phoneNumber() : profile.phoneNumber());

    if (request.birthdate() != null &&
      !request.birthdate().isEmpty() &&
      !request.birthdate().isBlank() &&
      DateUtils.isLocalDate(request.birthdate(), DateTimeFormatter.ISO_LOCAL_DATE)
    ) {
      newProfile.setBirthday(
        LocalDate.parse(request.birthdate(), DateTimeFormatter.ISO_LOCAL_DATE)
      );
    }

    if (request.address() != null &&
      !request.address().isEmpty() &&
      !request.address().isBlank() &&
      !request.address().equalsIgnoreCase(profile.address())) {
      newProfile.setAddress(request.address());
    }

    newProfile.setGender(request.gender() != null ? request.gender() : profile.gender());
    newProfile.setProfileId(IdEncoder.decode(profile.id()));

    return returnUserProfile(pSrv.updateProfile(newProfile), user);
  }

  private @NonNull UserDTO getUserNonLockedById(String id) {
    var user = uSrv.getUserById(id);

    if (user.isLocked()) {
      throw new DisabledException(Constant.SE_07);
    }
    return user;
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
