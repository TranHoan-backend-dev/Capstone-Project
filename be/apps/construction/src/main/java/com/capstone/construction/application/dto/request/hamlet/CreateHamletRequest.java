package com.capstone.construction.application.dto.request.hamlet;

import com.capstone.construction.infrastructure.utils.Message;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record CreateHamletRequest(
  @Schema(description = "Hamlet name", example = "Ấp 1")
  @NotBlank(message = Message.PT_24)
  String name,

  @Schema(description = "Hamlet type", example = "Hamlet")
  @NotBlank(message = Message.PT_25)
  String type,

  @Schema(description = "Commune ID this hamlet belongs to", example = "uuid-123")
  @NotBlank(message = Message.PT_26)
  String communeId
) {
}
