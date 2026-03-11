package com.capstone.construction.application.dto.request.installationform;

import com.capstone.construction.infrastructure.utils.Message;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record ApproveRequest(
  @Schema(description = "Mã nhân viên phê duyệt", example = "EMP-001")
  @NotBlank(message = Message.PT_36)
  @NotEmpty(message = Message.PT_36)
  String empId,

  @Schema(description = "Số hồ sơ", example = "HS2024-001")
  @NotBlank(message = Message.PT_28)
  @NotEmpty(message = Message.PT_28) String formNumber,

  @Schema(description = "Mã biểu mẫu (Biểu số)", example = "BM-01")
  @NotBlank(message = Message.PT_01)
  @NotEmpty(message = Message.PT_01) String formCode,

  @Schema(description = "Trạng thái (true: Phê duyệt, false: Từ chối)", example = "true")
  @NotNull(message = "Status cannot be null") Boolean status
) {
}
