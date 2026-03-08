package com.capstone.auth.application.business.profile;

import com.capstone.auth.application.business.dto.ProfileDTO;
import com.capstone.auth.domain.model.Profile;

public interface ProfileService {
  ProfileDTO getProfileById(String id);

  ProfileDTO getProfileByCredentials(String value);

  ProfileDTO updateProfile(Profile profile);

  ProfileDTO updateAvatar(String id, String avatar);

  String getAvatar(String id);
}
