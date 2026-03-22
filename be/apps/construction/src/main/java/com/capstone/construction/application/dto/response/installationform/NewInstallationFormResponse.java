package com.capstone.construction.application.dto.response.installationform;

import java.time.LocalDateTime;

public record NewInstallationFormResponse(
  String formNumber,
  String customerName,
  String formCode,
  String creator,
  LocalDateTime createdAt) {
}
