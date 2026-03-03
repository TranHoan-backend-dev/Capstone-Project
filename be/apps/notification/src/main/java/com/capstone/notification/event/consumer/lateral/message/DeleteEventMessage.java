package com.capstone.notification.event.consumer.lateral.message;

public record DeleteEventMessage(
  String pattern,
  LateralEventData data) {
  public record LateralEventData(
    String name,
    String network) {
  }
}
