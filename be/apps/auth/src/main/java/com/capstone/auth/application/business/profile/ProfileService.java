package com.capstone.auth.application.business.profile;

import com.capstone.auth.application.dto.response.ProfileResponse;

public interface ProfileService {
  ProfileResponse getUserById(String id);
}
