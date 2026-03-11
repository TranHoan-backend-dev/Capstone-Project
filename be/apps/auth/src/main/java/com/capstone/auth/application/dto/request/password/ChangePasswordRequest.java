package com.capstone.auth.application.dto.request.password;

import com.capstone.auth.infrastructure.utils.Message;
import com.capstone.common.utils.SharedConstant;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;

@Builder
@Schema(description = "Request object for changing the user's password")
public record ChangePasswordRequest(
  @Schema(description = "Current password of the user", example = "OldPass123!", requiredMode = Schema.RequiredMode.REQUIRED)
  @NotBlank(message = "Old password cannot be empty") String oldPassword,

  @Schema(description = "New password to set (must meet complexity requirements)", example = "NewPass456!", requiredMode = Schema.RequiredMode.REQUIRED)
  @NotBlank(message = "New password cannot be empty") @Pattern(regexp = SharedConstant.PASSWORD_PATTERN, message = Message.PT_02) String newPassword,

  @Schema(description = "Confirmation of the new password (must match newPassword)", example = "NewPass456!", requiredMode = Schema.RequiredMode.REQUIRED)
  @NotBlank(message = "Confirm password cannot be empty") String confirmPassword) {
}
