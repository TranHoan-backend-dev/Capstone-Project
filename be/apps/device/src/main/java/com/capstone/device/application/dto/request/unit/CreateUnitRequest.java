package com.capstone.device.application.dto.request.unit;

import com.capstone.device.infrastructure.util.Constant;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Yêu cầu tạo mới đơn vị đo")
public record CreateUnitRequest(
  @Schema(description = "Tên đơn vị đo", example = "Cái")
  @NotBlank(message = Constant.ENT_49)
  String name
) {
}
