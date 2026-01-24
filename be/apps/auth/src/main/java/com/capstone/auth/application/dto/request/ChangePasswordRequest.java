package com.capstone.auth.application.dto.request;

import com.capstone.auth.infrastructure.config.Constant;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;

@Builder
public record ChangePasswordRequest(
        @NotBlank(message = "Old password cannot be empty") String oldPassword,

        @NotBlank(message = "New password cannot be empty") @Pattern(regexp = Constant.PASSWORD_PATTERN, message = Constant.PT_02) String newPassword,

        @NotBlank(message = "Confirm password cannot be empty") String confirmPassword) {
}
