package com.capstone.construction.application.dto.response.catalog;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

public record RoadmapResponse(
        @Schema(description = "Roadmap ID", example = "uuid-123") String roadmapId,

        @Schema(description = "Roadmap name", example = "Lộ trình 1") String name,

        @Schema(description = "Lateral ID", example = "uuid-lat-123") String lateralId,

        @Schema(description = "Lateral name", example = "Tuyến D100") String lateralName,

        @Schema(description = "Water supply network ID", example = "uuid-net-123") String networkId,

        @Schema(description = "Network name", example = "Trạm bơm số 1") String networkName,

        @Schema(description = "Creation timestamp") LocalDateTime createdAt) {
}
