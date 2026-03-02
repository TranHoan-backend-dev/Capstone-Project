package com.capstone.auth.application.dto.request;

import com.capstone.auth.infrastructure.config.Constant;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
@Schema(description = "Request object for verifying the OTP code")
public record VerifyOtpRequest(
        @Schema(description = "Email address of the user", example = "user@example.com", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = Constant.PT_01) @Email(message = Constant.PT_01) String email,

        @Schema(description = "One-Time Password (OTP) code to verify", example = "123456", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "OTP cannot be empty") String otp) {
}
