package com.capstone.auth.adapter;

import com.capstone.auth.application.dto.request.UpdateProfileRequest;
import com.capstone.auth.application.dto.response.UserProfileResponse;
import com.capstone.auth.application.dto.response.WrapperApiResponse;
import com.capstone.auth.application.usecase.ProfileUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/me")
@SecurityRequirement(name = "Keycloak")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Authentication", description = "Operations for user authentication, registration, OTP, and profile management.")
public class ProfileController {
  ProfileUseCase profileUC;

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
    @ApiResponse(responseCode = "200", description = "Profile retrieved successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = UserProfileResponse.class))),
    @ApiResponse(responseCode = "400", description = "Bad Request - Token claims (email/username) do not match database records or are invalid", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "401", description = "Unauthorized - Valid JWT token is missing or expired", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "403", description = "Forbidden - The user account is locked or disabled", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Internal Server Error - An unexpected error occurred", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @GetMapping()
  public ResponseEntity<WrapperApiResponse> me(@AuthenticationPrincipal Jwt jwt) {
    var id = jwt.getSubject();

    Map<String, Object> claims = jwt.getClaims();
    log.info("Get profile request comes to endpoint: {}", id);

    return ResponseEntity.ok(new WrapperApiResponse(
      HttpStatus.OK.value(),
      "Get profile successfully",
      profileUC.getMe(
        id,
        claims.get("email").toString(),
        claims.get("preferred_username").toString()),
      LocalDateTime.now()));
  }

  @Operation(summary = "Update Current User Profile", description = "Updates the profile information of the currently authenticated user. "
    +
    "Fields like fullName, phoneNumber, and birthdate are validated before updating. " +
    "Only provided non-null fields will be updated; others retain their current values.")
  @ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "Profile updated successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = UserProfileResponse.class))),
    @ApiResponse(responseCode = "400", description = "Bad Request - Validation failed for one or more fields (e.g., invalid phone format, invalid date)", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "401", description = "Unauthorized - Valid JWT token is missing or expired", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "403", description = "Forbidden - The user account is locked or disabled", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Internal Server Error - An unexpected error occurred", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PostMapping()
  public ResponseEntity<WrapperApiResponse> updateProfile(
    @AuthenticationPrincipal Jwt jwt,

    @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Updated profile information", required = true, content = @Content(schema = @Schema(implementation = UpdateProfileRequest.class)))
    @NonNull
    @RequestBody
    UpdateProfileRequest request
  ) {
    var id = jwt.getSubject();
    log.info("User's id: {}", id);

    return ResponseEntity.ok(new WrapperApiResponse(
      HttpStatus.OK.value(),
      "Update profile successfully",
      profileUC.updateProfile(id, request),
      LocalDateTime.now()));
  }

//  @PutMapping()
//  public ResponseEntity<WrapperApiResponse> updateProfile(
//    @AuthenticationPrincipal Jwt jwt,
//
//  ) {}
}
