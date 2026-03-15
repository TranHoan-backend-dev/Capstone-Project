package com.capstone.notification.exception;

import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import org.jspecify.annotations.NonNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(NullPointerException.class)
  public ResponseEntity<WrapperApiResponse> handleNullPointerException(@NonNull NullPointerException ex) {
    return Utils.returnUnAuthorizedResponse(ex.getMessage(), null);
  }
}
