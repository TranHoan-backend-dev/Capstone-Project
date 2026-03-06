package com.capstone.construction.application.dto.request.branch;

import com.capstone.common.utils.SharedConstant;
import com.capstone.construction.infrastructure.config.Constant;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record CreateRequest(
  @Schema(description = "Network name", example = "Trạm bơm số 1")
  @NotBlank(message = Constant.PT_59)
  @Pattern(regexp = SharedConstant.VIETNAMESE_CHARACTER_PATTERN)
  String name) {
}
