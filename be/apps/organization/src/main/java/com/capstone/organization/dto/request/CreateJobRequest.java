package com.capstone.organization.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Request to create a new job position")
public record CreateJobRequest(
    @Schema(description = "Name of the job position", example = "Software Engineer") @NotBlank String name) {
}
