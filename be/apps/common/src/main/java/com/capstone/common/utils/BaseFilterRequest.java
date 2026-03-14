package com.capstone.common.utils;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Pattern;

public record BaseFilterRequest(
  @Schema(description = "Từ khóa tìm kiếm", example = "Nguyễn Văn A")
  String keyword,

  @Schema(description = "Ngày bắt đầu lọc (dd-MM-yyyy)", example = "01-01-2023")
  @Pattern(regexp = "^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-(19|20)\\d\\d$")
  String from,

  @Schema(description = "Ngày kết thúc lọc (dd-MM-yyyy)", example = "31-12-2023")
  @Pattern(regexp = "^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-(19|20)\\d\\d$")
  String to
) {
}
