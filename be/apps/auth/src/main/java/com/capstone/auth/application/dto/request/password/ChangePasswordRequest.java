package com.capstone.auth.application.dto.request.password;

import com.capstone.auth.infrastructure.utils.Message;
import com.capstone.common.utils.SharedConstant;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;

@Schema(description = "")
public record ChangePasswordRequest(
  @Schema(description = "", example = "OldPass123!", requiredMode = Schema.RequiredMode.REQUIRED)
  @NotBlank(message = Message.PT_17)
  @NotEmpty(message = Message.PT_17)
  String oldPassword,

  @Schema(description = "", example = "NewPass456!", requiredMode = Schema.RequiredMode.REQUIRED)
  @NotBlank(message = Message.PT_18)
  @NotEmpty(message = Message.PT_18)
  @Pattern(regexp = SharedConstant.PASSWORD_PATTERN, message = Message.PT_01)
  String newPassword
) {
}
