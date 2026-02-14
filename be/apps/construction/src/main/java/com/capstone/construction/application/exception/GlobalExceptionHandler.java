package com.capstone.construction.application.exception;

import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import org.apache.coyote.BadRequestException;
import org.jspecify.annotations.NonNull;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.concurrent.ExecutionException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(ExistingItemException.class)
  public ResponseEntity<WrapperApiResponse> handleExistingItemException(@NonNull ExistingItemException ex) {
    log.error("Conflict error: {}", ex.getMessage());
    return Utils.returnConflictResponse(ex.getMessage(), null);
  }

  @ExceptionHandler(BadRequestException.class)
  public ResponseEntity<WrapperApiResponse> handleBadRequestException(@NonNull BadRequestException ex) {
    log.error("Bad request error: {}", ex.getMessage());
    return Utils.returnBadRequestResponse(ex.getMessage(), null);
  }

  @ExceptionHandler(BadCredentialsException.class)
  public ResponseEntity<WrapperApiResponse> handleBadCredentialsException(@NonNull BadCredentialsException ex) {
    log.error("Auth error: {}", ex.getMessage());
    return Utils.returnUnAuthorizedResponse("Invalid email or password", null);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<WrapperApiResponse> handleValidationExceptions(@NonNull MethodArgumentNotValidException ex) {
    log.warn("Validation error on request: {}", ex.getObjectName());
    var errors = new HashMap<>();
    ex.getBindingResult().getAllErrors().forEach((error) -> {
      var fieldName = ((FieldError) error).getField();
      var errorMessage = error.getDefaultMessage();
      errors.put(fieldName, errorMessage);
    });

    return Utils.returnBadRequestResponse("Validation failed", errors);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<WrapperApiResponse> handleGlobalException(@NonNull Exception ex) {
    log.error("Unexpected error occurred: {}", ex.getMessage());
    return Utils.returnInternalServerErrorResponse(ex.getMessage(), null);
  }

  @ExceptionHandler({InterruptedException.class, ExecutionException.class})
  public ResponseEntity<WrapperApiResponse> handleInterruptedAndExecutionException(@NonNull Exception ex) {
    log.error("Concurrency error: ", ex);
    return Utils.returnInternalServerErrorResponse(ex.getMessage(), null);
  }
}
