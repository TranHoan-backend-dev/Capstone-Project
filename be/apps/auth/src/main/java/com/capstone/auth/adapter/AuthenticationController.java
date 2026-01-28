package com.capstone.auth.adapter;

import com.capstone.auth.application.dto.request.ChangePasswordRequest;
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
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.parameters.RequestBody;

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
@Tag(name = "Authentication", description = "Operations for user authentication, registration, OTP, and profile management.")
public class AuthenticationController {
    AuthUseCase authUC;
    OtpUseCase otpUC;

    @Operation(summary = "Register new account", description = "Registers a new user account with employee details including role, department, and water supply network.")
    @RequestBody(description = "Details for the new user account", required = true, content = @Content(schema = @Schema(implementation = SignupRequest.class)))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Account created successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
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

    @Operation(summary = "Change password (Authenticated)", description = "Changes the password for the currently logged-in user. Requires the old password and the new password.")
    @RequestBody(description = "Old password, new password, and confirmation", required = true, content = @Content(schema = @Schema(implementation = ChangePasswordRequest.class)))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Password changed successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
            @ApiResponse(responseCode = "400", description = "Bad Request - Old password incorrect or new passwords do not match"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing JWT token"),
            @ApiResponse(responseCode = "500", description = "Internal Server Error")
    })
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody @Valid ChangePasswordRequest request) {
      log.info("Change password request comes to endpoint: {}", jwt);
        var email = jwt.getClaim("email");
        authUC.changePassword(email.toString(), request.oldPassword(), request.newPassword(), request.confirmPassword());

        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(),
                "Change password successfully",
                null,
                LocalDateTime.now()));
    }

    @Operation(summary = "Get Current User Profile", description = "Retrieves the profile of the currently authenticated user based on the JWT token. "
            +
            "Flow: 1. Extracts the user ID (subject) and claims (email, preferred_username) from the JWT. "
            +
            "2. Validates that the account associated with the ID exists and is not locked/disabled. "
            +
            "3. Verifies that the email and username in the token match the records in the database. "
            +
            "4. Returns the user's profile information.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Profile retrieved successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
            @ApiResponse(responseCode = "400", description = "Bad Request - Token claims (email/username) do not match database records"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing JWT token"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Account is disabled or locked"),
            @ApiResponse(responseCode = "500", description = "Internal Server Error")
    })
    @GetMapping("/me")
    public ResponseEntity<?> me(@AuthenticationPrincipal Jwt jwt) {
        var id = jwt.getSubject();

        Map<String, Object> claims = jwt.getClaims();
        log.info("Get profile request comes to endpoint: {}", id);

        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(),
                "Get profile successfully",
                authUC.getMe(
                        id,
                        claims.get("email").toString(),
                        claims.get("preferred_username").toString()),
                LocalDateTime.now()));
    }

    @Operation(summary = "Login with JWT", description = "Authenticates the user using the JWT token from the Authorization header. "
            +
            "It extracts user claims (email, preferred_username), validates the user's existence, account status (not deleted, locked or disabled) and data consistency against the database. "
            +
            "Returns a success wrapper containing the user's profile information (UserProfileResponse) in the 'data' field if successful.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
            @ApiResponse(responseCode = "400", description = "Bad Request - Invalid claims or user data mismatch"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Account is deleted, disabled or locked"),
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
