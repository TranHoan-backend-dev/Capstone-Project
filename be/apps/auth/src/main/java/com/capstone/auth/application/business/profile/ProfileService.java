package com.capstone.auth.application.business.profile;

import com.capstone.auth.application.business.dto.ProfileResponse;

public interface ProfileService {
  ProfileResponse getProfileById(String id);
  ProfileResponse getProfileByCredentials(String value);
}
