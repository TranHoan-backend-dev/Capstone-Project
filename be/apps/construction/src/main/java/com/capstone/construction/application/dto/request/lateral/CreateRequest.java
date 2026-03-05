package com.capstone.construction.application.dto.request.lateral;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

public record CreateRequest(
  @Schema(description = "Lateral name", example = "Tuyến D100")
  @NotEmpty
  @NotBlank
  String name,

  @Schema(description = "Water supply network ID this lateral belongs to", example = "uuid-net-123")
  @NotEmpty
  @NotBlank
  String networkId) {
}
