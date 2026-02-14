package com.capstone.organization.exception;

import com.capstone.common.exception.InternalServerException;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
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
    return Utils.returnBadRequestResponse("Input data is invalid. Please check your input data in the log", null);
  }

  @ExceptionHandler(InternalServerException.class)
  public ResponseEntity<WrapperApiResponse> handleInternalServerException(@NonNull InternalServerException ex) {
    return Utils.returnInternalServerErrorResponse(ex.getMessage(), null);
  }
}
