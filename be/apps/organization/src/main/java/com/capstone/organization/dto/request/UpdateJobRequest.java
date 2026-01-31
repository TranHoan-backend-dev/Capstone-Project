package com.capstone.organization.dto.request;

import jakarta.validation.constraints.NotBlank;

public record UpdateJobRequest(
  @NotBlank String name
) {
}
