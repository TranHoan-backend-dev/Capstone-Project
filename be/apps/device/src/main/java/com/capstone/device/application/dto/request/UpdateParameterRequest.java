package com.capstone.device.application.dto.request;

import com.capstone.device.infrastructure.util.Message;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

@Schema(description = "Yêu cầu cập nhật tham số hệ thống")
public record UpdateParameterRequest(
  @Schema(description = "Tên tham số", example = "VAT")
  @NotBlank(message = Message.ENT_50)
  @NotEmpty(message = Message.ENT_50)
  String name,

  @Schema(description = "Giá trị tham số", example = "0.08")
  @NotNull(message = Message.ENT_51)
  @Min(value = 0, message = Message.ENT_53)
  BigDecimal value,

  @Schema(description = "ID của người cập nhật", example = "uuid-v4")
  @NotBlank(message = Message.ENT_52)
  @NotEmpty(message = Message.ENT_52)
  String updatorId
) {
}
