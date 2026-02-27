package com.capstone.notification.event.consumer.commune.message;

public record DeleteEventMessage(
  String pattern,
  CommuneEventData data
) {
  public record CommuneEventData(
    String name,
    String type
  ) {

  }
}
