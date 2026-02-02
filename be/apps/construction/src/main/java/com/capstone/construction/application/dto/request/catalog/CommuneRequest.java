package com.capstone.construction.application.dto.request.catalog;

import com.capstone.construction.infrastructure.config.Constant;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record CommuneRequest(
        @Schema(description = "Commune name", example = "Phú Hòa") @NotBlank(message = Constant.PT_21) String name,

        @Schema(description = "Commune type (e.g. Ward, Commune, Town)", example = "Commune") @NotBlank(message = Constant.PT_22) String type) {
}
