package com.capstone.construction.application.dto.request.catalog;

import com.capstone.construction.infrastructure.config.Constant;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record RoadmapRequest(
        @Schema(description = "Roadmap name", example = "Lộ trình 1") @NotBlank(message = Constant.PT_73) String name,

        @Schema(description = "Lateral ID this roadmap belongs to", example = "uuid-lat-123") @NotBlank(message = Constant.PT_74) String lateralId,

        @Schema(description = "Water supply network ID this roadmap belongs to", example = "uuid-net-123") @NotBlank(message = Constant.PT_59) String networkId) {
}
