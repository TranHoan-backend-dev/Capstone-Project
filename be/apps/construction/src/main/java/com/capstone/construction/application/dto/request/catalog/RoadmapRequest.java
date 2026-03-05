package com.capstone.construction.application.dto.request.catalog;

import io.swagger.v3.oas.annotations.media.Schema;

public record RoadmapRequest(
  @Schema(description = "Roadmap name", example = "Lộ trình 1")
  String name,

  @Schema(description = "Lateral ID this roadmap belongs to", example = "uuid-lat-123")
  String lateralId,

  @Schema(description = "Water supply network ID this roadmap belongs to", example = "uuid-net-123")
  String networkId) {
}
