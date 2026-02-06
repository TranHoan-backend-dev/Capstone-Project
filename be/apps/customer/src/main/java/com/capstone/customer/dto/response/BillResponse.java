package com.capstone.customer.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Response DTO for Bill information.
 */
@Schema(description = "Response DTO for Bill information")
public record BillResponse(
        @Schema(description = "Bill ID / Customer ID (since they share the same ID)") String billId,

        @Schema(description = "Bill name") String billName,

        @Schema(description = "Bill note") String note,

        @Schema(description = "Export address") String exportAddress,

        @Schema(description = "Associated customer name") String customerName) {
}
