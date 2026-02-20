package com.capstone.notification.event.consumer.commune.message;

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
