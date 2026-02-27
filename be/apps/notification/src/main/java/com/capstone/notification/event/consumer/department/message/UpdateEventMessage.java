package com.capstone.notification.event.consumer.department.message;

public record UpdateEventMessage(
  String pattern,
  LateralEventData data
) {
  public record LateralEventData(
  ) {
  }
}
