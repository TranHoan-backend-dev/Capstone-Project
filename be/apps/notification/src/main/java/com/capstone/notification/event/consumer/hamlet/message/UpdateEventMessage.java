package com.capstone.notification.event.consumer.hamlet.message;

public record UpdateEventMessage(
  String pattern,
  LateralEventData data) {
  public record LateralEventData(
    String oldName,
    String newName,
    String oldType,
    String newType,
    String oldCommune,
    String newCommune) {
  }
}
