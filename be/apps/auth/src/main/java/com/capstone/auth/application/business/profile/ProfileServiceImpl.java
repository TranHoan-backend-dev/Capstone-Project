package com.capstone.auth.application.business.profile;

import com.capstone.auth.application.dto.response.ProfileResponse;
import com.capstone.auth.application.exception.NotExistingException;
import com.capstone.auth.domain.repository.ProfileRepository;
import com.capstone.auth.infrastructure.utils.IdEncoder;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProfileServiceImpl implements ProfileService {
  ProfileRepository repo;

  @Override
  public ProfileResponse getUserById(String id) {
    Objects.requireNonNull(id, "id cannot be null");
    var profile = repo.findById(id);
    if (profile.isEmpty()) {
      throw new NotExistingException("Profile with id " + id + " does not exist");
    }
    return new ProfileResponse(
      IdEncoder.encode(profile.get().getId()),
      profile.get().getFullname(),
      profile.get().getAvatarUrl(),
      profile.get().getAddress(),
      profile.get().getPhoneNumber(),
      profile.get().getGender(),
      profile.get().getBirthday().toString()
    );
  }
}
