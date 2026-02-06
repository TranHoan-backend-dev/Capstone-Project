package com.capstone.auth.application.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Result of checking if username or email already exists")
public record CheckExistenceResponse(
                @Schema(description = "Whether the username exists", example = "true") boolean isUsernameExists,
                @Schema(description = "Whether the email exists", example = "false") boolean isEmailExists) {
}
