package com.capstone.notification.dto.response;

import java.time.LocalDateTime;

public record NotificationResponse(
  String notificationId,
  String title,
  String link,
  String message,
  Boolean status,
  LocalDateTime createdAt
) {
}
