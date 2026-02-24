package com.capstone.notification.event.consumer.department.message;

public record DeleteEventMessage(
  String pattern,
  LateralEventData data
) {
  public record LateralEventData(
  ) {

  }
}
