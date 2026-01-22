package com.capstone.auth.adapter;

import com.capstone.auth.application.dto.request.SignupRequest;
import com.capstone.auth.application.dto.request.VerifyEmailRequest;
import com.capstone.auth.application.dto.response.WrapperApiResponse;
import com.capstone.auth.application.usecase.AuthUseCase;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.concurrent.ExecutionException;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthController {
  AuthUseCase authUC;
  // TODO: custom error code

  @PostMapping("/signup")
  public ResponseEntity<?> signup(@RequestBody @Valid SignupRequest request) throws ExecutionException, InterruptedException {
    log.info("Signup request comes to endpoint: {}", request);

    authUC.register(
      request.username(),
      request.password(),
      request.email(),
      request.status()
    );

    return ResponseEntity.ok(new WrapperApiResponse(
      HttpStatus.OK.value(),
      "Create account successfully",
      null,
      LocalDateTime.now()
    ));
  }

  @PostMapping("/verify-email")
  public ResponseEntity<?> verifyEmail(@RequestBody @Valid VerifyEmailRequest request) {

    return ResponseEntity.ok(new WrapperApiResponse(
      HttpStatus.OK.value(),
      "Create account successfully",
      null,
      LocalDateTime.now()
    ));
  }

  @PatchMapping("/forgot-password")
  public ResponseEntity<?> forgotPassword() {
    log.info("Forgot password request comes to endpoint");

    return ResponseEntity.ok(new WrapperApiResponse(
      HttpStatus.OK.value(),
      "Reset password successfully",
      null,
      LocalDateTime.now()
    ));
  }

  @PatchMapping("/reset-password")
  public ResponseEntity<?> resetPassword() {
    log.info("Reset password request comes to endpoint");

    return ResponseEntity.ok(new WrapperApiResponse(
      HttpStatus.OK.value(),
      "Reset password successfully",
      null,
      LocalDateTime.now()
    ));
  }

  @GetMapping("/me")
  public ResponseEntity<?> me(@RequestParam @RequestHeader("Authorization") String id) {
    log.info("Get profile request comes to endpoint: {}", id);

    return ResponseEntity.ok(new WrapperApiResponse(
      HttpStatus.OK.value(),
      "Get profile successfully",
      authUC.getProfile(id),
      LocalDateTime.now()
    ));
  }
}
