package com.capstone.organization.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CreateJobRequest(
  @NotBlank String name
) {
}
