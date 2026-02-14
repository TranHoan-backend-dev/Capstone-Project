package com.capstone.construction.application.dto.response.installationform;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

public record NewInstallationFormResponse(
  @Schema(description = "Unique form number", example = "LF-2024-002")
  String formNumber,

  @Schema(description = "Customer name", example = "Trần Hoàng")
  String customerName,

  @Schema(description = "Customer address", example = "123 Main St")
  String address,

  @Schema(description = "Phone number", example = "0901234567")
  String phoneNumber,

  @Schema(description = "Timestamp when the form was created")
  LocalDateTime createdAt) {
}
