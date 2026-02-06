package com.capstone.construction.application.dto.request.catalog;

import com.capstone.construction.infrastructure.config.Constant;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record WaterSupplyNetworkRequest(
        @Schema(description = "Network name", example = "Trạm bơm số 1") @NotBlank(message = Constant.PT_23) String name) {
}
