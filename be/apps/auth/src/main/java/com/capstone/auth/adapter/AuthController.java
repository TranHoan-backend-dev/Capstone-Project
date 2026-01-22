package com.capstone.auth.adapter;

import com.capstone.auth.application.dto.request.CheckExistenceRequest;
import com.capstone.auth.application.dto.request.ResetPasswordRequest;
import com.capstone.auth.application.dto.request.SendOtpRequest;
import com.capstone.auth.application.dto.request.SignupRequest;
import com.capstone.auth.application.dto.request.VerifyOtpRequest;
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
  public ResponseEntity<?> signup(@RequestBody @Valid SignupRequest request)
      throws ExecutionException, InterruptedException {
    log.info("Signup request comes to endpoint: {}", request);

    authUC.register(
        request.username(),
        request.password(),
        request.email(),
        request.status());

    return ResponseEntity.ok(new WrapperApiResponse(
        HttpStatus.OK.value(),
        "Create account successfully",
        null,
        LocalDateTime.now()));
  }

  @PostMapping("/check-existence")
  public ResponseEntity<?> checkExistence(
      @RequestBody @Valid CheckExistenceRequest request) {
    return ResponseEntity.ok(new WrapperApiResponse(
        HttpStatus.OK.value(),
        "Check existence successfully",
        authUC.checkExistence(request.username(), request.email()),
        LocalDateTime.now()));
  }

  @PostMapping("/send-otp")
  public ResponseEntity<?> sendOtp(
      @RequestBody @Valid SendOtpRequest request) {
    authUC.sendOtp(request.email());
    return ResponseEntity.ok(new WrapperApiResponse(
        HttpStatus.OK.value(),
        "Send OTP successfully",
        null,
        LocalDateTime.now()));
  }

  @PostMapping("/verify-otp")
  public ResponseEntity<?> verifyOtp(
      @RequestBody @Valid VerifyOtpRequest request) {
    var isValid = authUC.verifyOtp(request.email(), request.otp());
    // if not valid, the service might return false or throw exception.
    // Implementation in service returns boolean without exception for mismatch, but
    // exception for expiry/not found.
    // Let's handle the boolean false case.

    return ResponseEntity.badRequest().body(new WrapperApiResponse(
        !isValid ? HttpStatus.BAD_REQUEST.value() : HttpStatus.OK.value(),
        !isValid ? "Invalid OTP" : "Verify OTP successfully",
        null,
        LocalDateTime.now()));
  }

  @PostMapping("/reset-password")
  public ResponseEntity<?> resetPassword(@RequestBody @Valid ResetPasswordRequest request) {
    authUC.resetPasswordWithOtp(request.email(), request.otp(), request.newPassword());
    return ResponseEntity.ok(new WrapperApiResponse(
        HttpStatus.OK.value(),
        "Reset password successfully",
        null,
        LocalDateTime.now()));
  }

  @GetMapping("/me")
  public ResponseEntity<?> me(@RequestParam @RequestHeader("Authorization") String id) {
    log.info("Get profile request comes to endpoint: {}", id);

    return ResponseEntity.ok(new WrapperApiResponse(
        HttpStatus.OK.value(),
        "Get profile successfully",
        authUC.getProfile(id),
        LocalDateTime.now()));
  }
}
