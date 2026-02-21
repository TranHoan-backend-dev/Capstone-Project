package com.capstone.construction.application.dto.response.catalog;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

public record LateralResponse(
  @Schema(description = "Lateral ID", example = "uuid-123") String id,

  @Schema(description = "Lateral name", example = "Tuyến D100") String name,

  @Schema(description = "Water supply network ID", example = "uuid-net-123") String networkId,

  @Schema(description = "Network name", example = "Trạm bơm số 1") String networkName,

  @Schema(description = "Creation timestamp") LocalDateTime createdAt) {
}
