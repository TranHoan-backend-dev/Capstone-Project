package com.capstone.construction.application.dto.request.branch;

import com.capstone.common.utils.SharedConstant;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Pattern;

public record UpdateRequest(
  @Schema(description = "Network name", example = "Trạm bơm số 1")
  @Pattern(regexp = SharedConstant.VIETNAMESE_CHARACTER_PATTERN, message = "Must contain only characters, not digits, not special characters")
  String name) {
}
