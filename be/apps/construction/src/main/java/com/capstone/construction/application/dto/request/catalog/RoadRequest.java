package com.capstone.construction.application.dto.request.catalog;

import com.capstone.construction.infrastructure.config.Constant;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record RoadRequest(
        @Schema(description = "Road name", example = "Trần Hưng Đạo") @NotBlank(message = Constant.PT_72) String name) {
}
