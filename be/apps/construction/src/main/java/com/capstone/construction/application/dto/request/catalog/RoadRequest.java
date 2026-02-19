package com.capstone.construction.application.dto.request.catalog;

import io.swagger.v3.oas.annotations.media.Schema;

public record RoadRequest(
  @Schema(description = "Road name", example = "Trần Hưng Đạo") String name) {
}
