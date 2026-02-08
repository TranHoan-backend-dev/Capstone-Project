package com.capstone.auth.application.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request object for updating user profile information")
public record UpdateProfileRequest(
    @Schema(description = "Full name of the user", example = "John Doe") String fullName,
    @Schema(description = "Username of the user", example = "johndoe") String username,
    @Schema(description = "Phone number of the user", example = "0987654321") String phoneNumber,
    @Schema(description = "Birthdate in ISO format", example = "1990-01-01") String birthdate,
    @Schema(description = "Living address", example = "123 ABC Street, District 1, HCM City") String address,
    @Schema(description = "Gender (true for Male, false for Female)", example = "true") Boolean gender) {
}
