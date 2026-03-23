package com.capstone.construction.application.dto.request.estimate;

import com.capstone.common.utils.SharedMessage;
import com.capstone.construction.infrastructure.utils.Message;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

@Schema(description = "Yêu cầu ký duyệt dự toán")
public record SignRequest(
  @Schema(description = "ID của dự toán", example = "EST-001")
  @NotBlank(message = SharedMessage.MES_07)
  @NotEmpty(message = SharedMessage.MES_07)
  String estimateId,

  @Schema(description = "URL của chữ ký điện tử", example = "https://example.com/sign.png")
  @NotBlank(message = Message.PT_64)
  @NotEmpty(message = Message.PT_64)
  String electronicSignUrl
) {
}
