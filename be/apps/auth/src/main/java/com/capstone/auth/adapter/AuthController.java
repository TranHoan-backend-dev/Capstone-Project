package com.capstone.auth.adapter;

import com.capstone.auth.application.dto.request.CheckExistenceRequest;
import com.capstone.auth.application.dto.request.ResetPasswordRequest;
import com.capstone.auth.application.dto.request.SendOtpRequest;
import com.capstone.auth.application.dto.request.SignupRequest;
import com.capstone.auth.application.dto.request.VerifyOtpRequest;
import com.capstone.auth.application.dto.response.WrapperApiResponse;
import com.capstone.auth.application.usecase.AuthUseCase;
import com.capstone.auth.application.usecase.OtpUseCase;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Authentication", description = "Operations for user authentication, registration, OTP, and profile management.")
public class AuthController {
  AuthUseCase authUC;
  OtpUseCase otpUC;
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

  // <editor-fold> desc="Forgot password"
  @PostMapping("/check-existence")
  public ResponseEntity<?> checkExistence(
    @RequestBody @Valid CheckExistenceRequest request) {
    return ResponseEntity.ok(new WrapperApiResponse(
      HttpStatus.OK.value(),
      "Check existence successfully",
      authUC.checkExistence(request.value()),
      LocalDateTime.now()));
  }

  @PostMapping("/send-otp")
  public ResponseEntity<?> sendOtp(
    @RequestBody @Valid SendOtpRequest request) {
    otpUC.sendOtp(request.email());
    return ResponseEntity.ok(new WrapperApiResponse(
      HttpStatus.OK.value(),
      "Send OTP successfully",
      null,
      LocalDateTime.now()));
  }

  @PostMapping("/verify-otp")
  public ResponseEntity<?> verifyOtp(
    @RequestBody @Valid VerifyOtpRequest request) {
    var isValid = otpUC.verifyOtp(request.email(), request.otp());
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
  // </editor-fold>

  @PostMapping("/reset-password")
  public ResponseEntity<?> resetPassword(@RequestBody @Valid ResetPasswordRequest request) {
    otpUC.resetPasswordWithOtp(request.email(), request.otp(), request.newPassword());
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

  @Operation(summary = "Login with JWT", description = "Authenticates the user using the JWT token from the Authorization header. "
    +
    "It extracts user claims (email, preferred_username), validates the user's existence and data consistency against the database. "
    +
    "Returns a success wrapper containing the user's profile information (UserProfileResponse) in the 'data' field if successful.")
  @ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "Login successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "400", description = "Bad Request - Invalid claims or user data mismatch"),
    @ApiResponse(responseCode = "500", description = "Internal Server Error")
  })
  @PostMapping("/login")
  public ResponseEntity<?> login(@AuthenticationPrincipal Jwt jwt) {
    log.info("Login request comes to endpoint: {}", jwt);

    var id = jwt.getSubject();
    Map<String, Object> claims = jwt.getClaims(); // username, email

    return ResponseEntity.ok(new WrapperApiResponse(
      HttpStatus.OK.value(),
      "Login successfully",
      authUC.login(
        id,
        claims.get("email").toString(),
        claims.get("preferred_username").toString()),
      LocalDateTime.now()));
  }
}
