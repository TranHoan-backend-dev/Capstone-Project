package com.capstone.common.utils;

import com.capstone.common.exception.InternalServerException;
import com.capstone.common.response.WrapperApiResponse;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.OffsetDateTime;
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

  public static LocalDateTime parseFrom(String from) {
    LocalDateTime startDate = null;

    if (from != null) {
      startDate = LocalDate.parse(from, DateTimeFormatter.ISO_LOCAL_DATE).atStartOfDay();
    }
    return startDate;
  }

  public static LocalDateTime parseTo(String to) {
    LocalDateTime endDate = null;

    if (to != null) {
      endDate = LocalDate.parse(to, DateTimeFormatter.ISO_LOCAL_DATE).atTime(LocalTime.MAX);
    }
    return endDate;
  }

  public static @NonNull String saveFile(@NonNull MultipartFile file) {
    // Dùng absolute path thay vì relative để tránh sự khác biệt giữa
    // Windows (working dir = apps/) và Linux (working dir = apps/device/)
    var uploadDir = Paths.get(System.getProperty("user.dir"), "uploads", "images");
    var fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
    var filePath = uploadDir.resolve(fileName);

    try {
      Files.createDirectories(uploadDir);
      Files.write(filePath, file.getBytes());
    } catch (IOException e) {
      throw new InternalServerException();
    }

    return fileName;
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
      OffsetDateTime.now()
    ));
  }
}
