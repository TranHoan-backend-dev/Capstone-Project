package com.capstone.construction.application.dto.request.installationform;

import com.capstone.common.utils.SharedMessage;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

public record ApproveRequest(
  @Schema(description = "Số đơn", example = "HS2024-001")
  @NotBlank(message = SharedMessage.MES_20)
  @NotEmpty(message = SharedMessage.MES_20)
  String formNumber,

  @Schema(description = "Mã đơn", example = "BM-01")
  @NotBlank(message = SharedMessage.MES_21)
  @NotEmpty(message = SharedMessage.MES_21)
  String formCode,

  @Schema(description = "Trạng thái (true: Phê duyệt, false: Từ chối, null: Chuyển từ đã duyệt sang đang chờ)", example = "true")
  Boolean status
) {
}
