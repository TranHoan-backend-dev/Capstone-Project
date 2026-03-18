package com.capstone.notification.dto.response;

public record IndividualNotificationResponse(
  String notificationId,
  Boolean isRead
) {
}
