package com.capstone.notification.event.consumer.materialprices.message;

public record DeleteEventMessage(
  String pattern,
  LateralEventData data) {
  public record LateralEventData(
    String name,
    String network) {
  }
}
