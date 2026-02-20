package com.capstone.notification.event.consumer.commune.message;

public record DeleteEventMessage(
  String pattern,
  LateralEventData data
) {
  public record LateralEventData(
    String name,
    String type
  ) {

  }
}
