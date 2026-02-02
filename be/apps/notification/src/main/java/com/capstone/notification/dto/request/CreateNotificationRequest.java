package com.capstone.notification.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CreateNotificationRequest(
  @NotBlank String message,
  String link
) {
}
