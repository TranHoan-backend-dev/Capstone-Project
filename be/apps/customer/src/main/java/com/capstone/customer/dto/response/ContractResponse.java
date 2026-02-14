package com.capstone.customer.dto.response;

import com.capstone.customer.model.Representative;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.List;

@Schema(description = "Response DTO for Water Usage Contract information")
public record ContractResponse(
  @Schema(description = "Unique identifier of the contract") String contractId,

  @Schema(description = "Creation timestamp") LocalDateTime createdAt,

  @Schema(description = "Last update timestamp") LocalDateTime updatedAt,

  @Schema(description = "Associated customer name") String customerName,

  @Schema(description = "Associated customer ID") String customerId,

  @Schema(description = "Installation form ID") String installationFormId,

  @Schema(description = "List of representatives") List<Representative> representatives) {
}
