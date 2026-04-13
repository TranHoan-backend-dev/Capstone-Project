package com.capstone.device.application.dto.request.unit;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Yêu cầu cập nhật đơn vị đo")
public record UpdateUnitRequest(
        @Schema(description = "Tên đơn vị đo mới", example = "Bộ")
        @NotBlank(message = "Tên đơn vị không được để trống")
        String name) {
}
