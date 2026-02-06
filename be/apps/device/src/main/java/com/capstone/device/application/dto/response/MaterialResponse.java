package com.capstone.device.application.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Response DTO for Material information.
 */
@Schema(description = "Response DTO for Material")
public record MaterialResponse(
        @Schema(description = "Material ID / Labor code") String id,

        @Schema(description = "Job content") String jobContent,

        @Schema(description = "Material price") BigDecimal price,

        @Schema(description = "Labor price") BigDecimal laborPrice,

        @Schema(description = "Labor price at rural commune") BigDecimal laborPriceAtRuralCommune,

        @Schema(description = "Construction machinery price") BigDecimal constructionMachineryPrice,

        @Schema(description = "Construction machinery price at rural commune") BigDecimal constructionMachineryPriceAtRuralCommune,

        @Schema(description = "Material group name") String groupName,

        @Schema(description = "Calculation unit name") String unitName,

        @Schema(description = "Creation timestamp") LocalDateTime createdAt,

        @Schema(description = "Last update timestamp") LocalDateTime updatedAt) {
}
