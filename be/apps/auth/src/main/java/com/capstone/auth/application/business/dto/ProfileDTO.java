package com.capstone.auth.application.business.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Detailed user profile data transfer object")
public record ProfileDTO(
    @Schema(description = "Profile ID", example = "uuid-123") String id,
    @Schema(description = "Full name", example = "John Doe") String fullname,
    @Schema(description = "Avatar URL stored in Google Cloud Storage", example = "https://example.com/avatar.jpg") String avatarUrl,
    @Schema(description = "Address", example = "123 ABC Street, District 1, HCM City") String address,
    @Schema(description = "Phone number", example = "0987123456") String phoneNumber,
    @Schema(description = "Gender", example = "Female") String gender,
    @Schema(description = "Date of birth", example = "1995-10-20") String birthday) {
}
