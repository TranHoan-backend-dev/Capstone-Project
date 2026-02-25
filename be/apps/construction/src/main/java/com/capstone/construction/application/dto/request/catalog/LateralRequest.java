package com.capstone.construction.application.dto.request.catalog;

import io.swagger.v3.oas.annotations.media.Schema;

public record LateralRequest(
  @Schema(description = "Lateral name", example = "Tuyến D100")
  String name,

  @Schema(description = "Water supply network ID this lateral belongs to", example = "uuid-net-123")
  String networkId) {
}
