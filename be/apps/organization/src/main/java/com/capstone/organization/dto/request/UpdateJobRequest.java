package com.capstone.organization.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Request to update an existing job position")
public record UpdateJobRequest(
    @Schema(description = "Name of the job position", example = "Senior Software Engineer") @NotBlank String name) {
}
