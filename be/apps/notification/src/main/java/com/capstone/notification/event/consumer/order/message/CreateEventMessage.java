package com.capstone.notification.event.consumer.order.message;

public record CreateEventMessage(
  String pattern,
  OrderData data
) {
  public record OrderData(
    String formCode,
    String formNumber,
    String customerName,
    String creator,
    String createdAt
  ) {
  }
}
