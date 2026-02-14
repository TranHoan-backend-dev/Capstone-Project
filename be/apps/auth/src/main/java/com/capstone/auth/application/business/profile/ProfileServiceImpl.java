package com.capstone.auth.application.business.profile;

import com.capstone.auth.application.business.dto.ProfileDTO;
import com.capstone.auth.application.exception.NotExistingException;
import com.capstone.auth.domain.model.Profile;
import com.capstone.auth.infrastructure.persistence.ProfileRepository;
import com.capstone.auth.infrastructure.config.Constant;
import com.capstone.common.utils.IdEncoder;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProfileServiceImpl implements ProfileService {
  ProfileRepository repo;

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
  public ProfileDTO updateProfile(Profile profile) {
    log.info("Updating profile: {}", profile);
    if (profile == null) {
      throw new IllegalArgumentException("Profile is null");
    }
    repo.save(profile);
    return convertToResponse(Optional.of(profile));
  }

  @Transactional
  @Override
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
      IdEncoder.encode(profile.get().getProfileId()),
      p.getFullname(),
      p.getAvatarUrl(),
      p.getAddress(),
      p.getPhoneNumber(),
      p.getGender(),
      p.getBirthday()
    );
  }
}
