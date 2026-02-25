package com.capstone.notification.event.consumer.calculationunit.message;

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
