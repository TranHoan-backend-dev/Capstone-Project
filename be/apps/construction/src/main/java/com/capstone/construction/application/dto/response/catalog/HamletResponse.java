package com.capstone.construction.application.dto.response.catalog;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

public record HamletResponse(
  @Schema(description = "Hamlet ID", example = "uuid-123") String hamletId,

  @Schema(description = "Hamlet name", example = "Ấp 1") String name,

  @Schema(description = "Hamlet type", example = "Hamlet") String type,

  @Schema(description = "Commune ID", example = "uuid-commune-123") String communeId,

  @Schema(description = "Commune name", example = "Phú Hòa") String communeName,

  @Schema(description = "Creation timestamp") LocalDateTime createdAt) {
}
