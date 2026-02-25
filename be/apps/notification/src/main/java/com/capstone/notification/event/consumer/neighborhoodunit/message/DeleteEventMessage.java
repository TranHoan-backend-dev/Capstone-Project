package com.capstone.notification.event.consumer.neighborhoodunit.message;

public record DeleteEventMessage(
  String pattern,
  UnitEventData data) {
  public record UnitEventData(
    String name,
    String network) {
  }
}
