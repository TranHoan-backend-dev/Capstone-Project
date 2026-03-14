package com.capstone.device.application.exception;

import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import org.jspecify.annotations.NonNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(MethodArgumentTypeMismatchException.class)
  public ResponseEntity<WrapperApiResponse> handleMethodArgumentTypeMismatchException(@NonNull MethodArgumentTypeMismatchException ex) {
    var field = ex.getName();
    var value = ex.getValue();
    Class<?> target = ex.getRequiredType();

    var message = String.format(
      "Parameter '%s' has invalid value '%s'. Expected type: %s",
      field, value, target.getSimpleName()
    );
    return Utils.returnBadRequestResponse(message, null);
  }
}
