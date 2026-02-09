package com.capstone.auth.adapter;

import com.capstone.auth.application.dto.request.ChangePasswordRequest;
import com.capstone.auth.application.dto.request.CheckExistenceRequest;
import com.capstone.auth.application.dto.request.ResetPasswordRequest;
import com.capstone.auth.application.dto.request.SendOtpRequest;
import com.capstone.auth.application.dto.request.SignupRequest;
import com.capstone.auth.application.dto.request.VerifyOtpRequest;
import com.capstone.auth.application.dto.response.UserProfileResponse;
import com.capstone.auth.application.dto.response.WrapperApiResponse;
import com.capstone.auth.application.usecase.AuthUseCase;
import com.capstone.auth.application.usecase.OtpUseCase;

import com.capstone.auth.infrastructure.utils.Utils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
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
@RequiredArgsConstructor
@RequestMapping("/auth")
@SecurityRequirement(name = "Keycloak")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Authentication", description = "Operations for user authentication, registration, OTP.")
public class AuthenticationController {
  AuthUseCase authUC;
  OtpUseCase otpUC;

  @Operation(summary = "Register new account", description = "Registers a new user account with employee details including role, department, and water supply network.")
  @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Details for the new user account", required = true, content = @Content(schema = @Schema(implementation = SignupRequest.class)))
  @ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "Registration successful. Returns WrapperApiResponse with data as null.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "400", description = "Bad Request - Validation failed or account already exists"),
    @ApiResponse(responseCode = "500", description = "Internal Server Error")
  })
  @PostMapping("/signup")
  public ResponseEntity<?> signup(@RequestBody @Valid SignupRequest request)
    throws ExecutionException, InterruptedException {
    log.info("Signup request comes to endpoint: {}", request);

    authUC.register(
      request.username(), request.password(),
      request.email(), request.roleId(), request.fullname(),
      request.jobId(), request.businessPageIds(),
      request.departmentId(), request.waterSupplyNetworkId());

    return ResponseEntity.ok(new WrapperApiResponse(
      HttpStatus.OK.value(),
      "Create account successfully",
      null,
      LocalDateTime.now()));
  }

  // <editor-fold> desc="Forgot password"
  @Operation(summary = "Check existence of username or email", description = "Checks if the provided username or email is already taken in the system.")
  @ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "Check successful. Returns WrapperApiResponse with data as CheckExistenceResponse object.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "400", description = "Bad Request")
  })
  @PostMapping("/check-existence")
  public ResponseEntity<?> checkExistence(
    @RequestBody @Valid CheckExistenceRequest request) {
    return ResponseEntity.ok(new WrapperApiResponse(
      HttpStatus.OK.value(),
      "Check existence successfully",
      authUC.checkExistence(request.value()),
      LocalDateTime.now()));
  }

  @Operation(summary = "Send OTP via email", description = "Sends an OTP code to the provided email for verification or password reset.")
  @ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "OTP sent successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "400", description = "Invalid or non-existent email")
  })
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

  @Operation(summary = "Verify OTP code", description = "Verifies the validity of the OTP code sent via email.")
  @ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "OTP verified successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "400", description = "Invalid or expired OTP code")
  })
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

  @Operation(summary = "Reset password with OTP", description = "Allows the user to set a new password after successful OTP verification.")
  @ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "Password reset successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "400", description = "Invalid OTP or incorrect data", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PostMapping("/reset-password")
  public ResponseEntity<?> resetPassword(@RequestBody @Valid ResetPasswordRequest request) {
    otpUC.resetPasswordWithOtp(request.email(), request.otp(), request.newPassword());
    return ResponseEntity.ok(new WrapperApiResponse(
      HttpStatus.OK.value(),
      "Reset password successfully",
      null,
      LocalDateTime.now()));
  }

  @Operation(summary = "Change password (Authenticated)", description = "Changes the password for the currently logged-in user. Requires the old password and the new password.")
  @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Old password, new password, and confirmation", required = true, content = @Content(schema = @Schema(implementation = ChangePasswordRequest.class)))
  @ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "Password changed successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "400", description = "Bad Request - Old password incorrect or new passwords do not match", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing JWT token", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Internal Server Error", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PostMapping("/change-password")
  public ResponseEntity<?> changePassword(
    @AuthenticationPrincipal Jwt jwt,
    @RequestBody @Valid ChangePasswordRequest request) {
    log.info("Change password request comes to endpoint: {}", jwt);
    var email = jwt.getClaim("email");
    authUC.changePassword(email.toString(), request.oldPassword(), request.newPassword(),
      request.confirmPassword());

    return Utils.returnResponse(
      HttpStatus.OK.value(),
      "Change password successfully",
      null);
  }

  @Operation(summary = "Login with JWT", description = "Authenticates the user using the JWT token from the Authorization header. "
    +
    "It extracts user claims (email, preferred_username), validates the user's existence, account status (not deleted, locked or disabled) and data consistency against the database. "
    +
    "Returns a success wrapper containing the user's profile information (UserProfileResponse) in the 'data' field if successful.")
  @ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "Login successful. Returns WrapperApiResponse with data as UserProfileResponse object containing personal information.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = UserProfileResponse.class))),
    @ApiResponse(responseCode = "400", description = "Bad Request - Invalid claims or user data mismatch", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "403", description = "Forbidden - Account is deleted, disabled or locked", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Internal Server Error", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PostMapping("/login")
  public ResponseEntity<?> login(@AuthenticationPrincipal Jwt jwt) {
    var id = jwt.getSubject();
    Map<String, Object> claims = jwt.getClaims(); // username, prefered_username, realm_access->roles

    return Utils.returnResponse(
      HttpStatus.OK.value(),
      "Login successfully",
      authUC.login(
        id,
        claims.get("email").toString(),
        claims.get("preferred_username").toString()));
  }
}
