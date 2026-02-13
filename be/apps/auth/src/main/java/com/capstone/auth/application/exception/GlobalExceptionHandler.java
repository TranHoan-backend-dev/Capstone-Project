package com.capstone.auth.application.exception;

import com.capstone.common.utils.WrapperApiResponse;
import org.apache.coyote.BadRequestException;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.concurrent.ExecutionException;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(BadRequestException.class)
  public ResponseEntity<WrapperApiResponse> handleBadRequestException(@NonNull BadRequestException ex) {
    return returnBadRequest(ex.getMessage());
  }

  @ExceptionHandler(NotExistingException.class)
  public ResponseEntity<WrapperApiResponse> handleUserNotFoundException(@NonNull NotExistingException ex) {
    return returnBadRequest(ex.getMessage());
  }

  @ExceptionHandler(IncompatibleAvatarException.class)
  public ResponseEntity<WrapperApiResponse> handleIncompatibleAvatarException(@NonNull IncompatibleAvatarException ex) {
    return returnBadRequest(ex.getMessage());
  }

  @ExceptionHandler(DateTimeParseException.class)
  public ResponseEntity<WrapperApiResponse> handleDateTimeParseException(@NonNull DateTimeParseException ex) {
    return returnBadRequest(ex.getMessage());
  }

  @ExceptionHandler(AccountBlockedException.class)
  public ResponseEntity<WrapperApiResponse> handleAccountBlockedException(@NonNull AccountBlockedException ex) {
    return ResponseEntity
      .status(HttpStatus.FORBIDDEN)
      .body(new WrapperApiResponse(
        HttpStatus.FORBIDDEN.value(),
        ex.getMessage(),
        null,
        LocalDateTime.now()
      ));
  }

  @ExceptionHandler(ExistingException.class)
  public ResponseEntity<WrapperApiResponse> handleExistingException(@NonNull ExistingException ex) {
    return returnBadRequest(ex.getMessage());
  }

  @ExceptionHandler(BadCredentialsException.class)
  public ResponseEntity<WrapperApiResponse> handleBadCredentialsException(BadCredentialsException ex) {
    return returnUnAuthorizedError("Invalid email or password");
  }

  @ExceptionHandler(DisabledException.class)
  public ResponseEntity<WrapperApiResponse> handleDisabledException(@NonNull DisabledException ex) {
    return returnUnAuthorizedError(ex.getMessage());
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<WrapperApiResponse> handleValidationExceptions(@NonNull MethodArgumentNotValidException ex) {
    var errors = new HashMap<>();
    ex.getBindingResult().getAllErrors().forEach((error) -> {
      var fieldName = ((FieldError) error).getField();
      var errorMessage = error.getDefaultMessage();
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

  @ExceptionHandler(InternalServerException.class)
  public ResponseEntity<WrapperApiResponse> handleInternalServerException(@NonNull InternalServerException ex) {
    return returnInternalServerError(ex.getMessage());
  }

  @ExceptionHandler({InterruptedException.class, ExecutionException.class})
  public ResponseEntity<WrapperApiResponse> handleInterruptedAndExecutionException(@NonNull Exception ex) {
    return returnInternalServerError(ex.getMessage());
  }

  private @NonNull ResponseEntity<WrapperApiResponse> returnBadRequest(String message) {
    return ResponseEntity
      .status(HttpStatus.BAD_REQUEST)
      .body(new WrapperApiResponse(
        HttpStatus.BAD_REQUEST.value(),
        message,
        null,
        LocalDateTime.now()
      ));
  }

  private @NonNull ResponseEntity<WrapperApiResponse> returnInternalServerError(String message) {
    return ResponseEntity
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .body(new WrapperApiResponse(
        HttpStatus.INTERNAL_SERVER_ERROR.value(),
        message,
        null,
        LocalDateTime.now()
      ));
  }

  private @NonNull ResponseEntity<WrapperApiResponse> returnUnAuthorizedError(String message) {
    return ResponseEntity
      .status(HttpStatus.UNAUTHORIZED)
      .body(new WrapperApiResponse(
        HttpStatus.UNAUTHORIZED.value(),
        message,
        null,
        LocalDateTime.now()
      ));
  }
}
