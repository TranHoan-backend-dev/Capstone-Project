package com.capstone.notification.event.consumer.neighborhoodunit.message;

public record UpdateEventMessage(
  String pattern,
  UnitEventData data) {
  public record UnitEventData(
    String oldName,
    String newName,
    String oldCommune,
    String newCommune) {
  }
}
