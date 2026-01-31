package com.capstone.organization.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateBusinessPageRequest(
  @NotBlank String name,
  @NotNull Boolean activate,
  @NotBlank String creator,
  @NotBlank String updator
) {
}
