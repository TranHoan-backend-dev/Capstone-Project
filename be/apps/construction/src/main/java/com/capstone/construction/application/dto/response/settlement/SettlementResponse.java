package com.capstone.construction.application.dto.response.settlement;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Schema(description = "Response representing a settlement")
public record SettlementResponse(
    @Schema(description = "Unique identifier of the settlement", example = "uuid-123") String settlementId,

    @Schema(description = "Job description/content") String jobContent,

    @Schema(description = "Construction address") String address,

    @Schema(description = "Connection fee") BigDecimal connectionFee,

    @Schema(description = "Optional note") String note,

    @Schema(description = "Creation timestamp") LocalDateTime createdAt,

    @Schema(description = "Update timestamp") LocalDateTime updatedAt,

    @Schema(description = "Registration date") LocalDate registrationAt) {
}
