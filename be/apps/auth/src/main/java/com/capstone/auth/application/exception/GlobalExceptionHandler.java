package com.capstone.auth.application.exception;

import com.capstone.common.exception.NotExistingException;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import org.apache.coyote.BadRequestException;
import org.jspecify.annotations.NonNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

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

  @ExceptionHandler(AccountBlockedException.class)
  public ResponseEntity<WrapperApiResponse> handleAccountBlockedException(@NonNull AccountBlockedException ex) {
    return Utils.returnForbiddenResponse(ex.getMessage(), null);
  }

  @ExceptionHandler(InternalServerError.class)
  public ResponseEntity<WrapperApiResponse> handleInternalServerError(@NonNull InternalServerError ex) {
    return Utils.returnInternalServerErrorResponse(ex.getMessage(), null);
  }
}
