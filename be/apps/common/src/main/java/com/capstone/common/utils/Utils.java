package com.capstone.common.utils;

import com.capstone.common.response.WrapperApiResponse;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpStatus;
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

  public static @NonNull ResponseEntity<WrapperApiResponse> returnOkResponse(String message, Object data) {
    return ResponseEntity.status(HttpStatus.OK.value()).body(new WrapperApiResponse(
      HttpStatus.OK.value(),
      message,
      data,
      LocalDateTime.now()
    ));
  }

  public static @NonNull ResponseEntity<WrapperApiResponse> returnCreatedResponse(String message, Object data) {
    return ResponseEntity.status(HttpStatus.CREATED.value()).body(new WrapperApiResponse(
      HttpStatus.CREATED.value(),
      message,
      data,
      LocalDateTime.now()
    ));
  }

  public static @NonNull ResponseEntity<WrapperApiResponse> returnBadRequestResponse(String message, Object data) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST.value()).body(new WrapperApiResponse(
      HttpStatus.BAD_REQUEST.value(),
      message,
      data,
      LocalDateTime.now()
    ));
  }

  public static @NonNull ResponseEntity<WrapperApiResponse> returnInternalServerErrorResponse(String message, Object data) {
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR.value()).body(new WrapperApiResponse(
      HttpStatus.INTERNAL_SERVER_ERROR.value(),
      message,
      data,
      LocalDateTime.now()
    ));
  }

  public static @NonNull ResponseEntity<WrapperApiResponse> returnUnAuthorizedResponse(String message, Object data) {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED.value()).body(new WrapperApiResponse(
      HttpStatus.UNAUTHORIZED.value(),
      message,
      data,
      LocalDateTime.now()
    ));
  }

  public static @NonNull ResponseEntity<WrapperApiResponse> returnForbiddenResponse(String message, Object data) {
    return ResponseEntity.status(HttpStatus.FORBIDDEN.value()).body(new WrapperApiResponse(
      HttpStatus.FORBIDDEN.value(),
      message,
      data,
      LocalDateTime.now()
    ));
  }

  public static @NonNull ResponseEntity<WrapperApiResponse> returnConflictResponse(String message, Object data) {
    return ResponseEntity.status(HttpStatus.CONFLICT.value()).body(new WrapperApiResponse(
      HttpStatus.CONFLICT.value(),
      message,
      data,
      LocalDateTime.now()
    ));
  }
}
