package com.capstone.construction.application.exception;

import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import org.jspecify.annotations.NonNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(ExistingItemException.class)
  public ResponseEntity<WrapperApiResponse> handleExistingItemException(@NonNull ExistingItemException ex) {
    return Utils.returnConflictResponse(ex.getMessage(), null);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<WrapperApiResponse> handleGlobalException(@NonNull Exception ex) {
    return Utils.returnInternalServerErrorResponse(ex.getMessage(), null);
  }
}
