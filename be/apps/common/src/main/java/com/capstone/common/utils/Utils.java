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
      return true;
    } catch (DateTimeParseException e) {
      return false;
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
    return buildResponse(HttpStatus.OK.value(), message, data);
  }

  public static @NonNull ResponseEntity<WrapperApiResponse> returnCreatedResponse(String message) {
    return buildResponse(HttpStatus.CREATED.value(), message, null);
  }

  public static @NonNull ResponseEntity<WrapperApiResponse> returnBadRequestResponse(String message, Object data) {
    return buildResponse(HttpStatus.BAD_REQUEST.value(), message, data);
  }

  public static @NonNull ResponseEntity<WrapperApiResponse> returnInternalServerErrorResponse(String message, Object data) {
    return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), message, data);
  }

  public static @NonNull ResponseEntity<WrapperApiResponse> returnUnAuthorizedResponse(String message, Object data) {
    return buildResponse(HttpStatus.UNAUTHORIZED.value(), message, data);
  }

  public static @NonNull ResponseEntity<WrapperApiResponse> returnForbiddenResponse(String message, Object data) {
    return buildResponse(HttpStatus.FORBIDDEN.value(), message, data);
  }

  public static @NonNull ResponseEntity<WrapperApiResponse> returnConflictResponse(String message, Object data) {
    return buildResponse(HttpStatus.CONFLICT.value(), message, data);
  }

  public static @NonNull ResponseEntity<WrapperApiResponse> returnNoContentResponse(String message) {
    return buildResponse(HttpStatus.NO_CONTENT.value(), message, null);
  }

  private static @NonNull ResponseEntity<WrapperApiResponse> buildResponse(int statusCode, String message, Object data) {
    return ResponseEntity.status(statusCode).body(new WrapperApiResponse(
      statusCode,
      message,
      data,
      LocalDateTime.now()
    ));
  }
}
