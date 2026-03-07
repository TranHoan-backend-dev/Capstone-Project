package com.capstone.auth.infrastructure.utils;

import com.capstone.auth.application.business.dto.UserDTO;
import com.capstone.auth.infrastructure.config.Constant;
import com.capstone.common.utils.SharedConstant;

public class AuthUtils {
  /**
   * Validate credentials before handling authentication business logic with account.
   * email and username sent in the request payload must be the same with user that get by id
   *
   * @param user     include role, username, email, isLocked, isEnabled. Get by id
   * @param email    email that sent in the request
   * @param username username that sent in the request
   */
  public static void validateCredentials(UserDTO user, String email, String username) {
    if (email != null && email.matches(SharedConstant.EMAIL_PATTERN)) {
      if (!email.equals(user.email())) {
        throw new IllegalArgumentException("Email does not match");
      }
    } else {
      throw new IllegalArgumentException(Constant.PT_01);
    }

    if (username != null) {
      if (!username.equals(user.username())) {
        throw new IllegalArgumentException("Username does not match");
      }
    } else {
      throw new IllegalArgumentException(Constant.PT_05);
    }
  }
}
