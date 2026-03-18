package com.capstone.construction.application.dto.request.settlement;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Schema(description = "Filter criteria for searching and filtering settlements")
public record SettlementFilterRequest(
    @Schema(description = "Search term to match against jobContent, address, or note (case-insensitive)", example = "road construction")
    String search,

    @Schema(description = "Filter by settlement status (e.g., PENDING, APPROVED, REJECTED)", example = "APPROVED")
    List<String> status,

    @Schema(description = "Filter by registration date range (from)", example = "2026-01-01")
    LocalDate registrationFrom,

    @Schema(description = "Filter by registration date range (to)", example = "2026-12-31")
    LocalDate registrationTo,

    @Schema(description = "Filter by connection fee range (minimum)", example = "1000000")
    BigDecimal connectionFeeMin,

    @Schema(description = "Filter by connection fee range (maximum)", example = "5000000")
    BigDecimal connectionFeeMax,

    @Schema(description = "Filter by creation date range (from)", example = "2026-01-01T00:00:00")
    LocalDateTime createdAtFrom,

    @Schema(description = "Filter by creation date range (to)", example = "2026-12-31T23:59:59")
    LocalDateTime createdAtTo
) {
    public SettlementFilterRequest {
        if (connectionFeeMin != null && connectionFeeMax != null && connectionFeeMin.compareTo(connectionFeeMax) > 0) {
            throw new IllegalArgumentException("connectionFeeMin cannot be greater than connectionFeeMax");
        }
    }
}