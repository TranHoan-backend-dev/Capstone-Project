package com.capstone.auth.application.dto.request;

import com.capstone.auth.infrastructure.config.Constant;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;

@Builder
public record ResetPasswordRequest(
        @NotBlank(message = Constant.PT_01) @Email(message = Constant.PT_01) String email,

        @NotBlank(message = "OTP cannot be empty") String otp,

        @Pattern(regexp = Constant.PASSWORD_PATTERN, message = Constant.PT_02) String newPassword) {
}
