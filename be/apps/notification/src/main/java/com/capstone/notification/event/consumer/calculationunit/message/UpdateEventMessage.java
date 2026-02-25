package com.capstone.notification.event.consumer.calculationunit.message;

public record UpdateEventMessage(
  String pattern,
  LateralEventData data
) {
  public record LateralEventData(
    String oldName,
    String newName,
    String oldType,
    String newType
  ) {
  }
}
