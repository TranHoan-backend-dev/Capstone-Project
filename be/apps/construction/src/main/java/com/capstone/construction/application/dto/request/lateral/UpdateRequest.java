package com.capstone.construction.application.dto.request.lateral;

import io.swagger.v3.oas.annotations.media.Schema;

public record UpdateRequest(
  @Schema(description = "Lateral name", example = "Tuyến D100")
  String name,

  @Schema(description = "Water supply network ID this lateral belongs to", example = "uuid-net-123")
  String networkId) {
}
