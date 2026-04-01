package com.capstone.construction.application.dto.request.installationform;

import com.capstone.common.utils.SharedMessage;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

public record ApproveRequest(
  @Schema(description = "Số đơn", example = "HS2024-001")
  @NotNull(message = SharedMessage.MES_20) Long formNumber,

  @Schema(description = "Mã đơn", example = "BM-01")
  @NotNull(message = SharedMessage.MES_21) Long formCode,

  @Schema(description = "Trạng thái (true: Phê duyệt, false: Từ chối, null: Chuyển từ đã duyệt sang đang chờ)", example = "true")
  Boolean status
) {
}
