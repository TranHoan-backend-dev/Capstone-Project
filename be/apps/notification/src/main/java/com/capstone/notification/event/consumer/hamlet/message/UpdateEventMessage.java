package com.capstone.notification.event.consumer.hamlet.message;

public record UpdateEventMessage(
  String pattern,
  HamletEventData data) {
  public record HamletEventData(
    String oldName,
    String newName,
    String oldType,
    String newType,
    String oldCommune,
    String newCommune) {
  }
}
