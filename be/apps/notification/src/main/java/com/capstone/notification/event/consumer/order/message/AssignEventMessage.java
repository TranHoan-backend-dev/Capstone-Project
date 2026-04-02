package com.capstone.notification.event.consumer.order.message;

public record AssignEventMessage(String pattern, ApproveEventData data) {
  public record ApproveEventData(
    String formCode,
    String formNumber,
    String empId
  ) {

  }
}
