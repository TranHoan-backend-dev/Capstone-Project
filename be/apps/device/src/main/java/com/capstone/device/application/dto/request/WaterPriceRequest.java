package com.capstone.device.application.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Request DTO for creating or updating a Water Price.
 */
@Schema(description = "Request DTO for Water Price")
public record WaterPriceRequest(
        @Schema(description = "Usage target", example = "DOMESTIC") @NotBlank(message = "Usage target is required") String usageTarget,

        @Schema(description = "Tax percentage", example = "5.0") @NotNull(message = "Tax is required") @DecimalMin(value = "0.0", message = "Tax cannot be negative") BigDecimal tax,

        @Schema(description = "Environment price / Protect environment fee", example = "1000.00") @DecimalMin(value = "0.0", message = "Environment price cannot be negative") BigDecimal environmentPrice,

        @Schema(description = "Application period starting date", example = "2023-01-01") @NotNull(message = "Application period is required") LocalDate applicationPeriod,

        @Schema(description = "Expiration date", example = "2023-12-31") @NotNull(message = "Expiration date is required") LocalDate expirationDate,

        @Schema(description = "Description of the price policy", example = "Chính sách giá nước sinh hoạt 2023") String description) {
}
