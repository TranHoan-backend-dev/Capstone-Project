package com.capstone.device.application.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

/**
 * Request DTO for creating or updating a Material.
 */
@Schema(description = "Request DTO for Material")
public record MaterialRequest(
        @Schema(description = "Job content / Description of the material", example = "Đào đất bằng thủ công") @NotBlank(message = "Job content is required") String jobContent,

        @Schema(description = "Material price", example = "100000.00") @NotNull(message = "Price is required") @DecimalMin(value = "0.0", message = "Price cannot be negative") BigDecimal price,

        @Schema(description = "Labor price", example = "50000.00") @NotNull(message = "Labor price is required") @DecimalMin(value = "0.0", message = "Labor price cannot be negative") BigDecimal laborPrice,

        @Schema(description = "Labor price at rural commune", example = "45000.00") @NotNull(message = "Labor price at rural commune is required") @DecimalMin(value = "0.0", message = "Labor price at rural commune cannot be negative") BigDecimal laborPriceAtRuralCommune,

        @Schema(description = "Construction machinery price", example = "20000.00") @NotNull(message = "Construction machinery price is required") @DecimalMin(value = "0.0", message = "Construction machinery price cannot be negative") BigDecimal constructionMachineryPrice,

        @Schema(description = "Construction machinery price at rural commune", example = "18000.00") @NotNull(message = "Construction machinery price at rural commune is required") @DecimalMin(value = "0.0", message = "Construction machinery price at rural commune cannot be negative") BigDecimal constructionMachineryPriceAtRuralCommune,

        @Schema(description = "Materials group ID", example = "group-uuid") String groupId,

        @Schema(description = "Calculation unit ID", example = "unit-uuid") String unitId) {
}
