package com.capstone.auth.application.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request object for checking the existence of a user by username or email")
public record CheckExistenceRequest(
        @Schema(description = "Username or email address to check", example = "user123", requiredMode = Schema.RequiredMode.REQUIRED)
        String value) {
}
