package com.capstone.construction.application.dto.response.catalog;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

public record WaterSupplyNetworkResponse(
        @Schema(description = "Network ID", example = "uuid-123") String branchId,

        @Schema(description = "Network name", example = "Trạm bơm số 1") String name,

        @Schema(description = "Creation timestamp") LocalDateTime createdAt) {
}
