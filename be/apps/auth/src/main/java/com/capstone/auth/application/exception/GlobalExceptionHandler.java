package com.capstone.auth.application.exception;

import com.capstone.common.exception.InternalServerException;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import org.apache.coyote.BadRequestException;
import org.jspecify.annotations.NonNull;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.concurrent.ExecutionException;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(BadRequestException.class)
  public ResponseEntity<WrapperApiResponse> handleBadRequestException(@NonNull BadRequestException ex) {
    return Utils.returnBadRequestResponse(ex.getMessage(), null);
  }

  @ExceptionHandler(NotExistingException.class)
  public ResponseEntity<WrapperApiResponse> handleUserNotFoundException(@NonNull NotExistingException ex) {
    return Utils.returnBadRequestResponse(ex.getMessage(), null);
  }

  @ExceptionHandler(IncompatibleAvatarException.class)
  public ResponseEntity<WrapperApiResponse> handleIncompatibleAvatarException(@NonNull IncompatibleAvatarException ex) {
    return Utils.returnBadRequestResponse(ex.getMessage(), null);
  }

  @ExceptionHandler(DateTimeParseException.class)
  public ResponseEntity<WrapperApiResponse> handleDateTimeParseException(@NonNull DateTimeParseException ex) {
    return Utils.returnBadRequestResponse(ex.getMessage(), null);
  }

  @ExceptionHandler(AccountBlockedException.class)
  public ResponseEntity<WrapperApiResponse> handleAccountBlockedException(@NonNull AccountBlockedException ex) {
    return Utils.returnForbiddenResponse(ex.getMessage(), null);
  }

  @ExceptionHandler(ExistingException.class)
  public ResponseEntity<WrapperApiResponse> handleExistingException(@NonNull ExistingException ex) {
    return Utils.returnBadRequestResponse(ex.getMessage(), null);
  }

  @ExceptionHandler(BadCredentialsException.class)
  public ResponseEntity<WrapperApiResponse> handleBadCredentialsException() {
    return Utils.returnUnAuthorizedResponse("Invalid email or password", null);
  }

  @ExceptionHandler(DisabledException.class)
  public ResponseEntity<WrapperApiResponse> handleDisabledException(@NonNull DisabledException ex) {
    return Utils.returnUnAuthorizedResponse(ex.getMessage(), null);
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

  @ExceptionHandler(InternalServerException.class)
  public ResponseEntity<WrapperApiResponse> handleInternalServerException(@NonNull InternalServerException ex) {
    return Utils.returnInternalServerErrorResponse(ex.getMessage(), null);
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<WrapperApiResponse> handleIIllegalArgumentException(@NonNull IllegalArgumentException ex) {
    return Utils.returnBadRequestResponse(ex.getMessage(), null);
  }

  @ExceptionHandler(InternalServerError.class)
  public ResponseEntity<WrapperApiResponse> handleInternalServerError(@NonNull InternalServerError ex) {
    return Utils.returnInternalServerErrorResponse(ex.getMessage(), null);
  }

  @ExceptionHandler({InterruptedException.class, ExecutionException.class})
  public ResponseEntity<WrapperApiResponse> handleInternalServerError(@NonNull Exception ex) {
    return Utils.returnInternalServerErrorResponse(ex.getMessage(), null);
  }
}
