package com.capstone.organization.dto.request.page;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Request to create a new business page")
public record CreateBusinessPageRequest(
  @Schema(description = "Name of the business page", example = "Sales Department") @NotBlank String name,
  @Schema(description = "Activation status", example = "true") @NotNull Boolean activate,
  @Schema(description = "Creator of the page", example = "admin") @NotBlank String creator,
  @Schema(description = "Updator of the page", example = "admin") @NotBlank String updator) {
}
