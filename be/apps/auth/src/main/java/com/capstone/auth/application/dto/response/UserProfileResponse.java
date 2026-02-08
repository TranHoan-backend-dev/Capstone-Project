package com.capstone.auth.application.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Detailed user profile information")
public record UserProfileResponse(
    @Schema(description = "Full name", example = "John Doe") String fullname,
    @Schema(description = "Avatar URL stored in Google Cloud Storage", example = "https://example.com/avatar.jpg") String avatarUrl,
    @Schema(description = "Address", example = "123 ABC Street, District 1, HCM City") String address,
    @Schema(description = "Phone number", example = "0987654321") String phoneNumber,
    @Schema(description = "Gender", example = "Male") String gender,
    @Schema(description = "Birthday", example = "1990-01-01") String birthday,
    @Schema(description = "User role", example = "USER") String role,
    @Schema(description = "Username", example = "johndoe") String username,
    @Schema(description = "Email address", example = "johndoe@example.com") String email) {
}
