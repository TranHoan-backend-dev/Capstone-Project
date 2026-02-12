package com.capstone.organization.utils;

import com.capstone.organization.dto.response.WrapperApiResponse;
import org.jspecify.annotations.NonNull;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;

public class Utils {
  public static @NonNull ResponseEntity<WrapperApiResponse> returnResponse(int status, String message, Object data) {
    return ResponseEntity.status(status).body(new WrapperApiResponse(
      status,
      message,
      data,
      LocalDateTime.now()
    ));
  }
}
