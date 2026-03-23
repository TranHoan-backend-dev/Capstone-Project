package com.capstone.notification.event.consumer.page.message;

public record UpdateEventMessage(
  String pattern,
  UpdateEventData data
) {
  public record UpdateEventData(
    String pageName
  ) {

  }
}
