package com.capstone.notification.event.consumer.order.message;

public record CreateEventMessage(
  String formCode,
  String formNumber,
  String customerName,
  String creator
) {
}
