package com.capstone.notification.event.consumer.construction.message;

public record UpdateMessage(
  String pattern,
  Content data
) {
}
