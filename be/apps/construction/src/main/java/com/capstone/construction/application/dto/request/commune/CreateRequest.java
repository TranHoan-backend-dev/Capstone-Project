package com.capstone.construction.application.dto.request.commune;

import com.capstone.construction.domain.enumerate.CommuneType;
import com.capstone.construction.infrastructure.utils.Constant;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateRequest(
  @Schema(description = "Commune name", example = "Phú Hòa")
  @NotBlank(message = Constant.PT_21)
  String name,

  @Schema(description = "Commune type (e.g. Ward, Commune, Town)", example = "Commune")
  @NotNull(message = Constant.PT_22)
  CommuneType type
) {
}
