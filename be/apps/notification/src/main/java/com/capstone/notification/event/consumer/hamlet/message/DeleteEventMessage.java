package com.capstone.notification.event.consumer.hamlet.message;

public record DeleteEventMessage(
  String pattern,
  LateralEventData data) {
  public record LateralEventData(
    String name,
    String type,
    String commune) {

  }
}
