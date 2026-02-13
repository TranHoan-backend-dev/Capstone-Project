package com.capstone.common.utils;

import org.jspecify.annotations.NonNull;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.UUID;

public class Utils {

  public static boolean isLocalDate(String value, DateTimeFormatter formatter) {
    try {
      LocalDate.parse(value, formatter);
      return false;
    } catch (DateTimeParseException e) {
      return true;
    }
  }

  public static boolean isUUID(String value) {
    if (value == null) return false;
    try {
      UUID.fromString(value);
      return true;
    } catch (IllegalArgumentException e) {
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
