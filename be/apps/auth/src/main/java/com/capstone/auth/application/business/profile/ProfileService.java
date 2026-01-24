package com.capstone.auth.application.business.profile;

import com.capstone.auth.application.business.dto.ProfileDTO;

public interface ProfileService {
  ProfileDTO getProfileById(String id);
  ProfileDTO getProfileByCredentials(String value);
}
