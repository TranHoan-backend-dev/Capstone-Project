package com.capstone.notification.event.consumer.construction.message;

public record ApproveMessage(
  String pattern,
  Content data
) {
}
