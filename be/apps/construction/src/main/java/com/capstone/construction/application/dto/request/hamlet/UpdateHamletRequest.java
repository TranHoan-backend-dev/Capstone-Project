package com.capstone.construction.application.dto.request.hamlet;

import io.swagger.v3.oas.annotations.media.Schema;

public record UpdateHamletRequest(
  @Schema(description = "Hamlet name", example = "Ấp 1")
  String name,

  @Schema(description = "Hamlet type", example = "Hamlet")
  String type,

  @Schema(description = "Commune ID this hamlet belongs to", example = "uuid-123")
  String communeId) {
}
