package com.capstone.notification.event.consumer.waterprices.message;

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
