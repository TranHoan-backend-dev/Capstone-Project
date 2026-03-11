package com.capstone.organization.dto.request.page;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Request to update an existing business page")
public record UpdateBusinessPageRequest(
    @Schema(description = "Name of the business page", example = "Sales Department Updated") @NotBlank String name,
    @Schema(description = "Activation status", example = "true") @NotNull Boolean activate,
    @Schema(description = "Updator of the page", example = "admin") @NotBlank String updator) {
}
