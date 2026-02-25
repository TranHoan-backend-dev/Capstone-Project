package com.capstone.notification.event.consumer.road.message;

public record UpdateEventMessage(
  String pattern,
  LateralEventData data) {
  public record LateralEventData(
    String oldName,
    String newName) {
  }
}
