package com.capstone.notification.event.consumer.road.message;

public record DeleteEventMessage(
  String pattern,
  LateralEventData data) {
  public record LateralEventData(
    String name) {
  }
}
