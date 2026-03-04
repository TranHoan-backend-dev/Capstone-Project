package com.capstone.organization.exception;

import com.capstone.common.exception.ExistingException;
import com.capstone.common.exception.InternalServerException;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import jakarta.validation.ConstraintViolationException;
import org.jspecify.annotations.NonNull;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;

@RestControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<WrapperApiResponse> handleUserNotFoundException() {
    return Utils.returnBadRequestResponse("Input data is invalid. Please check your input data in the log", null);
  }

  @ExceptionHandler(InternalServerException.class)
  public ResponseEntity<WrapperApiResponse> handleInternalServerException(@NonNull InternalServerException ex) {
    return Utils.returnInternalServerErrorResponse(ex.getMessage(), null);
  }

  @ExceptionHandler(ExistingException.class)
  public ResponseEntity<WrapperApiResponse> handleExistingException(@NonNull ExistingException ex) {
    return Utils.returnBadRequestResponse(ex.getMessage(), null);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<WrapperApiResponse> handleValidationExceptions(@NonNull MethodArgumentNotValidException ex) {
    var errors = new HashMap<>();
    ex.getBindingResult().getAllErrors().forEach((error) -> {
      var fieldName = ((FieldError) error).getField();
      var errorMessage = error.getDefaultMessage();
      errors.put(fieldName, errorMessage);
    });

    return Utils.returnBadRequestResponse("Validation failed", errors);
  }
}
