package com.capstone.notification.event.consumer.employee.message;

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
