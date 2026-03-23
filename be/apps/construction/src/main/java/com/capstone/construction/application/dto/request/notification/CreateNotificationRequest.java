package com.capstone.construction.application.dto.request.notification;

import jakarta.validation.constraints.NotBlank;

public record CreateNotificationRequest(
  String title,
  @NotBlank String message,
  String link
) {
}
