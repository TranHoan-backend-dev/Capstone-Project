package com.capstone.notification.event.consumer.materialsgroup.message;

public record DeleteEventMessage(
  String pattern,
  LateralEventData data) {
  public record LateralEventData(
    String name,
    String network) {
  }
}
