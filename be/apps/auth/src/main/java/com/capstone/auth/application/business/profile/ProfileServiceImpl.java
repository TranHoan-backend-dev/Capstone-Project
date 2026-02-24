package com.capstone.auth.application.business.profile;

import com.capstone.auth.application.business.dto.ProfileDTO;
import com.capstone.auth.application.exception.NotExistingException;
import com.capstone.auth.domain.model.Profile;
import com.capstone.auth.infrastructure.persistence.ProfileRepository;
import com.capstone.auth.infrastructure.config.Constant;
import com.capstone.common.annotation.AppLog;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;
import java.util.Optional;

@AppLog
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProfileServiceImpl implements ProfileService {
  ProfileRepository repo;
  @NonFinal
  Logger log;

  @Override
  public ProfileDTO getProfileById(String id) {
    log.info("Getting profile by id: {}", id);
    Objects.requireNonNull(id, "id cannot be null");
    var profile = repo.findById(id);
    return convertToResponse(profile);
  }

  @Override
  public ProfileDTO getProfileByCredentials(String value) {
    log.info("Getting profile by credentials: {}", value);
    Objects.requireNonNull(value, "id cannot be null");
    var profile = value.matches(Constant.EMAIL_PATTERN) ? repo.findByUsersEmail(value) : repo.findByUsersUsername(value);
    return convertToResponse(profile);
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public ProfileDTO updateProfile(Profile profile) {
    log.info("Updating profile: {}", profile);
    Objects.requireNonNull(profile, "Profile is null");
    repo.save(profile);
    return convertToResponse(Optional.of(profile));
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public ProfileDTO updateAvatar(String id, String avatar) {
    log.info("Update avatar with id: {} and avatar url: {}", id, avatar);
    repo.updateAvatarByProfileId(id, avatar);
    return convertToResponse(repo.findById(id));
  }

  private ProfileDTO convertToResponse(@NonNull Optional<Profile> profile) {
    if (profile.isEmpty()) {
      throw new NotExistingException("Profile does not exist");
    }
    var p = profile.get();
    return new ProfileDTO(
      profile.get().getProfileId(),
      p.getFullname(),
      p.getAvatarUrl(),
      p.getAddress(),
      p.getPhoneNumber(),
      p.getGender(),
      p.getBirthday()
    );
  }
}
