package com.capstone.notification.event.consumer.order.message;

public record ApproveEventMessage(String pattern, ApproveEventData data) {
  public record ApproveEventData(
    String empId,
    String formCode,
    String formNumber,
    String creator,
    String customerName,
    String createdAt
  ) {

  }
}
