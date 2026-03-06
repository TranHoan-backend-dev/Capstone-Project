package com.capstone.image.exception;

import org.jspecify.annotations.NonNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import com.capstone.common.utils.Utils;

@RestControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler(NullPointerException.class)
  public ResponseEntity<?> handeNullPointerException(@NonNull NullPointerException exception) {
    return Utils.returnBadRequestResponse("NullPointerException", exception.getMessage());
  }
}
