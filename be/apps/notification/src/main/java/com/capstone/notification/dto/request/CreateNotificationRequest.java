package com.capstone.notification.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CreateNotificationRequest(
  String title,
  @NotBlank String message,
  String link
) {
}
