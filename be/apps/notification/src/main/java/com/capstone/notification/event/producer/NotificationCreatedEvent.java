package com.capstone.notification.event.producer;

import java.util.List;

public record NotificationCreatedEvent(
  String notificationId,
  List<String> topics
) {
}
