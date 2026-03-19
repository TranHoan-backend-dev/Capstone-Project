package com.capstone.device.application.dto.response.water;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;

/**
 * Response DTO for Water Meter information.
 */
@Schema(description = "Response DTO for Water Meter")
public record WaterMeterResponse(
        @Schema(description = "Water meter ID") String id,

        @Schema(description = "Installation date") LocalDate installationDate,

        @Schema(description = "Meter size") Integer size,

        @Schema(description = "Water meter type name") String typeName) {
}
