package com.capstone.notification.event.consumer.order.message;

public record RejectEventMessage(
  String pattern,
  OrderData data
) {
  public record OrderData(
    String empId, // order receiving staff id
    String formCode,
    String formNumber,
    String customerName
  ) {

  }
}
