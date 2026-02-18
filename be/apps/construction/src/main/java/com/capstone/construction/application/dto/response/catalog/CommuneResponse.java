package com.capstone.construction.application.dto.response.catalog;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;

public record CommuneResponse(
  @Schema(description = "Commune ID", example = "uuid-123")
  String communeId,

  @Schema(description = "Commune name", example = "Phú Hòa")
  String name,

  @Schema(description = "Commune type", example = "Commune")
  String type,

  @Schema(description = "Creation timestamp")
  LocalDate createdAt
) {
}
