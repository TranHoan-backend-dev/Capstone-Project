package com.capstone.notification.event.consumer.commune.message;

public record UpdateEventMessage(
  String pattern,
  CommuneEventData data
) {
  public record CommuneEventData(
    String oldName,
    String newName,
    String oldType,
    String newType
  ) {
  }
}
