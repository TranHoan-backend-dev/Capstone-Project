package com.capstone.notification.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record CreateDepartmentNotificationRequest(
  String title,
  @NotBlank String message,
  String link,
  @NotNull Boolean sendToAllDepartments,
  List<String> targetDepartmentCodes
) {
}

