package com.capstone.auth.application.dto.request.password;

import com.capstone.auth.infrastructure.utils.Message;
import com.capstone.common.utils.SharedConstant;
import com.capstone.common.utils.SharedMessage;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;

@Builder
@Schema(description = "Request object for resetting the password using OTP")
public record ResetPasswordRequest(
  @Schema(description = "Email address of the user", example = "user@example.com", requiredMode = Schema.RequiredMode.REQUIRED)
  @NotBlank(message = SharedMessage.MES_01)
  @Email(message = SharedMessage.MES_01) String email,

  @Schema(description = "One-Time Password (OTP) received via email", example = "123456", requiredMode = Schema.RequiredMode.REQUIRED)
  @NotBlank(message = "OTP cannot be empty") String otp,

  @Schema(description = "New password to set (must meet complexity requirements)", example = "NewPass789!", requiredMode = Schema.RequiredMode.REQUIRED)
  @Pattern(regexp = SharedConstant.PASSWORD_PATTERN, message = Message.PT_02)
  String newPassword) {
}
