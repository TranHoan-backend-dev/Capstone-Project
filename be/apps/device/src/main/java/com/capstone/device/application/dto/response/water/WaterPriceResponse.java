package com.capstone.device.application.dto.response.water;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Schema(description = "Response DTO for Water Price")
public record WaterPriceResponse(
  @Schema(description = "Water price ID") String id,

  @Schema(description = "Usage target") String usageTarget,

  @Schema(description = "Tax percentage") BigDecimal tax,

  @Schema(description = "Environment price") BigDecimal environmentPrice,

  @Schema(description = "Application period") LocalDate applicationPeriod,

  @Schema(description = "Expiration date") LocalDate expirationDate,

  @Schema(description = "Description") String description,

  @Schema(description = "Creation timestamp") LocalDateTime createdAt,

  @Schema(description = "Last update timestamp") LocalDateTime updatedAt) {
}
