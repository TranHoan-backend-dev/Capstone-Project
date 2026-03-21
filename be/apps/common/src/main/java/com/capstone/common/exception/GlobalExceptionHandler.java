package com.capstone.common.exception;

import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import feign.FeignException;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.concurrent.ExecutionException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(DateTimeParseException.class)
  public ResponseEntity<WrapperApiResponse> handleDateTimeParseException(@NonNull DateTimeParseException ex) {
    return Utils.returnBadRequestResponse(ex.getMessage(), null);
  }

  @ExceptionHandler(ForbiddenException.class)
  public ResponseEntity<WrapperApiResponse> handleForbiddenException(@NonNull ForbiddenException ex) {
    return Utils.returnForbiddenResponse(ex.getMessage(), null);
  }

  @ExceptionHandler(ExistingException.class)
  public ResponseEntity<WrapperApiResponse> handleExistingException(@NonNull ExistingException ex) {
    return Utils.returnBadRequestResponse(ex.getMessage(), null);
  }

  @ExceptionHandler(HttpMessageNotReadableException.class)
  public ResponseEntity<WrapperApiResponse> handleHttpMessageNotReadableException(@NonNull HttpMessageNotReadableException ex) {
    log.info(ex.getMessage());
    return Utils.returnBadRequestResponse("Đầu vào dữ liệu không hợp lệ", null);
  }

  @ExceptionHandler(BadCredentialsException.class)
  public ResponseEntity<WrapperApiResponse> handleBadCredentialsException(@NonNull BadCredentialsException ex) {
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

  @ExceptionHandler(FeignException.class)
  public ResponseEntity<WrapperApiResponse> handleFeignException(@NonNull FeignException ex) {
    return Utils.returnInternalServerErrorResponse(ex.getMessage(), null);
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<WrapperApiResponse> handleIllegalArgumentException(@NonNull IllegalArgumentException ex) {
    return Utils.returnBadRequestResponse(ex.getMessage(), null);
  }

  @ExceptionHandler({InterruptedException.class, ExecutionException.class})
  public ResponseEntity<WrapperApiResponse> handleInterruptedAndExecutionException(@NonNull Exception ex) {
    return Utils.returnInternalServerErrorResponse(ex.getMessage(), null);
  }
}
