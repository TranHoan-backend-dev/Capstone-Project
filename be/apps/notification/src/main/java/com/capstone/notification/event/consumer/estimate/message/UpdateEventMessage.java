package com.capstone.notification.event.consumer.estimate.message;

public record UpdateEventMessage(
  String pattern,
  CreateEventMessage.EstData data
) {
}
