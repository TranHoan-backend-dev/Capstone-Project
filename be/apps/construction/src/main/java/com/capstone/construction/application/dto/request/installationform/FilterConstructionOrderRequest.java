package com.capstone.construction.application.dto.request.installationform;

import jakarta.validation.constraints.Pattern;

public record FilterConstructionOrderRequest(
  String keyword,

  @Pattern(regexp = "dd-MM-yyyy")
  String from,

  @Pattern(regexp = "dd-MM-yyyy")
  String to
) {
}
