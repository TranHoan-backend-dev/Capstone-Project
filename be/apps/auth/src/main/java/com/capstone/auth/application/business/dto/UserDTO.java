package com.capstone.auth.application.business.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "User account information data transfer object")
public record UserDTO(
        @Schema(description = "User role", example = "USER") String role,
        @Schema(description = "Username", example = "johndoe") String username,
        @Schema(description = "Email address", example = "johndoe@gmail.com") String email,
        @Schema(description = "Account lock status", example = "false") boolean isLocked,
        @Schema(description = "Account enabled status", example = "true") boolean isEnabled) {
}
