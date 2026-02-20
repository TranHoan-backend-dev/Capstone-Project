package com.capstone.notification.event.consumer.unit.message;

public record UpdateEventMessage(
  String pattern,
  UnitEventData data) {
  public record UnitEventData(
    String oldName,
    String newName,
    String oldNetwork,
    String newNetwork) {
  }
}
