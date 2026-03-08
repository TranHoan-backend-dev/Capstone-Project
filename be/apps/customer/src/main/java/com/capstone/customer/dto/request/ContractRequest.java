package com.capstone.customer.dto.request;

import com.capstone.customer.utils.Constant;
import com.capstone.customer.model.Representative;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

@Schema(description = "Request DTO for creating or updating a Water Usage Contract")
public record ContractRequest(
  @Schema(description = "Contract ID", example = "HD001")
  @NotBlank(message = Constant.ENT_12) String contractId,

  @Schema(description = "Customer ID associated with this contract")
  @NotBlank(message = "Customer ID is required") String customerId,

  @Schema(description = "Installation form ID associated with this contract")
  @NotBlank(message = Constant.ENT_09) String installationFormId,

  @Schema(description = "List of representatives for the contract")
  @NotEmpty(message = "At least one representative is required") List<Representative> representatives) {
}
