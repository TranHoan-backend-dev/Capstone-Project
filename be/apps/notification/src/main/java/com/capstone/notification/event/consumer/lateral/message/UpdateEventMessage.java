package com.capstone.notification.event.consumer.lateral.message;

public record UpdateEventMessage(
  String pattern,
  LateralEventData data) {
  public record LateralEventData(
    String oldName,
    String newName,
    String oldNetwork,
    String newNetwork) {
  }
}
