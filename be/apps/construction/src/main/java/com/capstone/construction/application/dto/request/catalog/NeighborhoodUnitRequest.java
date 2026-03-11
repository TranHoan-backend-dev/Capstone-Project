package com.capstone.construction.application.dto.request.catalog;

import com.capstone.construction.infrastructure.utils.Message;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record NeighborhoodUnitRequest(
  @Schema(description = "Neighborhood unit name", example = "Tổ 1")
  @NotBlank(message = Message.PT_71) String name,

  @Schema(description = "Commune ID this unit belongs to", example = "uuid-123")
  @NotBlank(message = Message.PT_26) String communeId) {
}
