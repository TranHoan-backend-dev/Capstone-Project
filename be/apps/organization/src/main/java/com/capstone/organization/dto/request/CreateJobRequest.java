package com.capstone.organization.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Yêu cầu tạo một chức danh công việc mới")
public record CreateJobRequest(
  @Schema(description = "Tên của chức danh công việc", example = "Kỹ sư phần mềm") @NotBlank String name) {
}
