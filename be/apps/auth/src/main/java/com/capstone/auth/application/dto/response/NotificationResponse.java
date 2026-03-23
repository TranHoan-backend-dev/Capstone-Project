package com.capstone.auth.application.dto.response;

public record NotificationResponse(
  String notificationId,
  Boolean isRead
) {
}
