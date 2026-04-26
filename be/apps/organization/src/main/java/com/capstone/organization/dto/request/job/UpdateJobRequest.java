package com.capstone.organization.dto.request.job;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Yêu cầu cập nhật một chức danh công việc hiện có")
public record UpdateJobRequest(
  @Schema(description = "Tên của chức danh công việc", example = "Kỹ sư phần mềm cao cấp")
  @NotBlank String name) {
}
