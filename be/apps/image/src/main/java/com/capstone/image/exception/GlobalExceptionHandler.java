package com.capstone.image.exception;

import org.jspecify.annotations.NonNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler(NullPointerException.class)
  public ResponseEntity<?> handeNullPointerException(@NonNull NullPointerException exception) {
    return ResponseEntity.badRequest().body(exception.getMessage());
  }
}
