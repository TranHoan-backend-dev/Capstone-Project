package com.capstone.common.utils;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Pattern;

public record BaseFilterRequest(
  @Schema(description = "Từ khóa tìm kiếm", example = "Nguyễn Văn A")
  String keyword,

  @Schema(description = "Ngày bắt đầu lọc (yyyy-MM-dd)", example = "2023-01-01")
  @Pattern(regexp = "dd-MM-yyyy")
  String from,

  @Schema(description = "Ngày kết thúc lọc (yyyy-MM-dd)", example = "2023-12-31")
  @Pattern(regexp = "dd-MM-yyyy")
  String to
) {
}
