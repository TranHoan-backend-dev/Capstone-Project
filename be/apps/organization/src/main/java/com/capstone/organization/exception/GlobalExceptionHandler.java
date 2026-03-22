package com.capstone.organization.exception;

import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<WrapperApiResponse> handleUserNotFoundException() {
    return Utils.returnBadRequestResponse("Input data is invalid. Please check your input data in the log", null);
  }
}
