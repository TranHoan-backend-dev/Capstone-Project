package com.capstone.device.application.dto.request.price;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;

import java.math.BigDecimal;
import java.time.LocalDate;

@Schema(description = "")
public record UpdateRequest(
  @Schema(description = "Usage target", example = "DOMESTIC")
  String usageTarget,

  @Schema(description = "Tax percentage", example = "5.0")
  @DecimalMin(value = "0.0", message = "Tax cannot be negative")
  BigDecimal tax,

  @Schema(description = "Environment price / Protect environment fee", example = "1000.00")
  @DecimalMin(value = "0.0", message = "Environment price cannot be negative")
  BigDecimal environmentPrice,

  @Schema(description = "Application period starting date", example = "2023-01-01")
  LocalDate applicationPeriod,

  @Schema(description = "Expiration date", example = "2023-12-31")
  LocalDate expirationDate,

  @Schema(description = "Description of the price policy", example = "Chính sách giá nước sinh hoạt 2023")
  String description
) {
}
