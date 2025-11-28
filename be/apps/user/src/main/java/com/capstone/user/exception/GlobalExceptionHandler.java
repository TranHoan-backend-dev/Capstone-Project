package com.capstone.user.exception;

import com.capstone.user.dto.response.WrapperApiResponse;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(BadRequestException.class)
  public ResponseEntity<WrapperApiResponse> handleBadRequestException(BadRequestException ex) {
    return ResponseEntity
      .status(HttpStatus.BAD_REQUEST)
      .body(new WrapperApiResponse(
        HttpStatus.BAD_REQUEST.value(),
        ex.getMessage(),
        null,
        LocalDateTime.now()
      ));
  }

  @ExceptionHandler(BadCredentialsException.class)
  public ResponseEntity<WrapperApiResponse> handleBadCredentialsException(BadCredentialsException ex) {
    return ResponseEntity
      .status(HttpStatus.UNAUTHORIZED)
      .body(new WrapperApiResponse(
        HttpStatus.UNAUTHORIZED.value(),
        "Invalid email or password",
        null,
        LocalDateTime.now()
      ));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<WrapperApiResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
    var errors = new HashMap<>();
    ex.getBindingResult().getAllErrors().forEach((error) -> {
      String fieldName = ((FieldError) error).getField();
      String errorMessage = error.getDefaultMessage();
      errors.put(fieldName, errorMessage);
    });

    var response = new WrapperApiResponse(
      HttpStatus.BAD_REQUEST.value(),
      "Validation failed",
      errors,
      LocalDateTime.now()
    );

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<WrapperApiResponse> handleGlobalException(Exception ex) {
    return ResponseEntity
      .status(HttpStatus.UNAUTHORIZED)
      .body(new WrapperApiResponse(
        HttpStatus.INTERNAL_SERVER_ERROR.value(),
        ex.getMessage(),
        null,
        LocalDateTime.now()
      ));
  }
}
