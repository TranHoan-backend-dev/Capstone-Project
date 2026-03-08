package com.capstone.auth.application.dto.request;

import com.capstone.auth.infrastructure.utils.Constant;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
@Schema(description = "Request object for sending OTP to a user's email")
public record SendOtpRequest(
        @Schema(description = "Email address to send the OTP to", example = "user@example.com", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = Constant.PT_01) @Email(message = Constant.PT_01) String email) {
}
