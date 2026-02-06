package com.capstone.construction.application.dto.request.catalog;

import com.capstone.construction.infrastructure.config.Constant;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record HamletRequest(
        @Schema(description = "Hamlet name", example = "Ấp 1") @NotBlank(message = Constant.PT_24) String name,

        @Schema(description = "Hamlet type", example = "Hamlet") @NotBlank(message = Constant.PT_25) String type,

        @Schema(description = "Commune ID this hamlet belongs to", example = "uuid-123") @NotBlank(message = Constant.PT_26) String communeId) {
}
