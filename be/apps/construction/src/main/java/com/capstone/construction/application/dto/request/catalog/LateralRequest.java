package com.capstone.construction.application.dto.request.catalog;

import com.capstone.construction.infrastructure.config.Constant;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record LateralRequest(
        @Schema(description = "Lateral name", example = "Tuyến D100") @NotBlank(message = Constant.PT_70) String name,

        @Schema(description = "Water supply network ID this lateral belongs to", example = "uuid-net-123") @NotBlank(message = Constant.PT_59) String networkId) {
}
