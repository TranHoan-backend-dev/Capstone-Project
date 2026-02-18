package com.capstone.construction.application.dto.response.catalog;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

public record NeighborhoodUnitResponse(
  @Schema(description = "Unit ID", example = "uuid-123") String unitId,

  @Schema(description = "Unit name", example = "Tổ 1") String name,

  @Schema(description = "Commune ID", example = "uuid-commune-123") String communeId,

  @Schema(description = "Commune name", example = "Phú Hòa") String communeName,

  @Schema(description = "Creation timestamp") LocalDateTime createdAt) {
}
