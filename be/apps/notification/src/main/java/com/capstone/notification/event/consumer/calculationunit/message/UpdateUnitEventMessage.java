package com.capstone.notification.event.consumer.calculationunit.message;

public record UpdateUnitEventMessage(
  String pattern,
  UnitEventData data) {
  public record UnitEventData(
    String oldName,
    String newName) {
  }
}
