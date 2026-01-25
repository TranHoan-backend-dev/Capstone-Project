package com.capstone.auth.application.business.profile;

import com.capstone.auth.application.business.dto.ProfileResponse;
import com.capstone.auth.application.exception.NotExistingException;
import com.capstone.auth.domain.model.Profile;
import com.capstone.auth.domain.repository.ProfileRepository;
import com.capstone.auth.infrastructure.config.Constant;
import com.capstone.auth.infrastructure.utils.IdEncoder;
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
  public ProfileResponse getProfileById(String id) {
    Objects.requireNonNull(id, "id cannot be null");
    var profile = repo.findById(id);
    return convertToResponse(profile, id);
  }

  @Override
  public ProfileResponse getProfileByCredentials(String value) {
    Objects.requireNonNull(value, "id cannot be null");
    var profile = value.matches(Constant.EMAIL_PATTERN) ? repo.findByUsersEmail(value) : repo.findByUsersUsername(value);
    return convertToResponse(profile, value);
  }

  private ProfileResponse convertToResponse(@NonNull Optional<Profile> profile, String value) {
    if (profile.isEmpty()) {
      throw new NotExistingException("Profile does not exist");
    }
    var p = profile.get();
    var avatarUrl = p.getAvatarUrl() == null ? "" : p.getAvatarUrl();
    var address = p.getAddress() == null ? "" : p.getAddress();
    var gender = p.getGender() == null ? "" : p.getGender().toString();
    var birthday = p.getBirthday() == null ? "" : p.getBirthday().toString();
    return new ProfileResponse(
      IdEncoder.encode(profile.get().getId()),
      profile.get().getFullname(),
      avatarUrl,
      address,
      profile.get().getPhoneNumber(),
      gender,
      birthday
    );
  }
}
