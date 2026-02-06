package com.capstone.construction.application.dto.response.catalog;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

public record RoadResponse(
        @Schema(description = "Road ID", example = "uuid-123") String roadId,

        @Schema(description = "Road name", example = "Trần Hưng Đạo") String name,

        @Schema(description = "Creation timestamp") LocalDateTime createdAt) {
}
