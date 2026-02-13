package com.capstone.organization.exception;

import com.capstone.common.exception.InternalServerException;
import com.capstone.common.response.WrapperApiResponse;
import jakarta.validation.ConstraintViolationException;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<WrapperApiResponse> handleUserNotFoundException(@NonNull ConstraintViolationException ex) {
    return ResponseEntity
      .status(HttpStatus.BAD_REQUEST)
      .body(new WrapperApiResponse(
        HttpStatus.BAD_REQUEST.value(),
        "Input data is invalid. Please check your input data in the log",
        null,
        LocalDateTime.now()
      ));
  }
  @ExceptionHandler(InternalServerException.class)
  public ResponseEntity<WrapperApiResponse> handleInternalServerException(@NonNull InternalServerException ex) {
    return ResponseEntity
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .body(new WrapperApiResponse(
        HttpStatus.INTERNAL_SERVER_ERROR.value(),
        ex.getMessage(),
        null,
        LocalDateTime.now()
      ));
  }
}
