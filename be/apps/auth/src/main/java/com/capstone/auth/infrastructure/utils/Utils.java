package com.capstone.auth.infrastructure.utils;

import com.capstone.auth.application.business.dto.UserDTO;
import com.capstone.auth.application.dto.response.WrapperApiResponse;
import com.capstone.auth.infrastructure.config.Constant;
import org.jspecify.annotations.NonNull;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class Utils {
  /**
   * Validate credentials before handling authentication business logic with account.
   * email and username sent in the request payload must be the same with user that get by id
   *
   * @param user     include role, username, email, isLocked, isEnabled. Get by id
   * @param email    email that sent in the request
   * @param username username that sent in the request
   */
  public static void validateCredentials(UserDTO user, String email, String username) {
    if (email != null && email.matches(Constant.EMAIL_PATTERN)) {
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

  public static boolean isLocalDate(String value, DateTimeFormatter formatter) {
    try {
      LocalDate.parse(value, formatter);
      return true;
    } catch (DateTimeParseException e) {
      return false;
    }
  }

  public static @NonNull ResponseEntity<WrapperApiResponse> returnResponse(int status, String message, Object data) {
    return ResponseEntity.status(status).body(new WrapperApiResponse(
      status,
      message,
      data,
      LocalDateTime.now()
    ));
  }
}
