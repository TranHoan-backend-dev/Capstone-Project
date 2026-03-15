package com.capstone.auth.application.dto.request.otp;

import com.capstone.common.utils.SharedMessage;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
@Schema(description = "Request object for sending OTP to a user's email")
public record SendOtpRequest(
  @Schema(description = "Email address to send the OTP to", example = "user@example.com", requiredMode = Schema.RequiredMode.REQUIRED)
  @NotBlank(message = SharedMessage.MES_02)
  @Email(message = SharedMessage.MES_01)
  String email
) {
}
