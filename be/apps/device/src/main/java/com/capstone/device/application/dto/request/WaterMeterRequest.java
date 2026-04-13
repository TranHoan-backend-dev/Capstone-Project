package com.capstone.device.application.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

@Schema(description = "Request DTO for Water Meter")
public record WaterMeterRequest(
  @Schema(description = "Water meter ID", example = "METER-001") String meterId,
  @Schema(description = "Installation date", example = "2023-10-27") @NotNull(message = "Installation date is required") LocalDate installationDate,

  @Schema(description = "Meter size", example = "15") @NotNull(message = "Size is required") @Min(value = 1, message = "Size must be greater than 0") Integer size,

  @Schema(description = "Water meter type ID", example = "type-uuid") @NotNull(message = "Water meter type ID is required") String typeId) {
}
