package com.capstone.device.application.dto.request.material;

import com.capstone.common.utils.SharedConstant;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;

public record GroupRequest(
  @Pattern(regexp = SharedConstant.VIETNAMESE_CHARACTER_PATTERN, message = "Do not have digits and special characters")
  @NotBlank
  @NotEmpty
  String name
) {
}
