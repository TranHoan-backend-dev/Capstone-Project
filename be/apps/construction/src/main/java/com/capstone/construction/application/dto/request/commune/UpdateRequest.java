package com.capstone.construction.application.dto.request.commune;

import com.capstone.construction.domain.enumerate.CommuneType;
import io.swagger.v3.oas.annotations.media.Schema;

public record UpdateRequest(
  @Schema(description = "Commune name", example = "Phú Hòa")
  String name,

  @Schema(description = "Commune type (e.g. Ward, Commune, Town)", example = "Commune")
  CommuneType type
) {
}
