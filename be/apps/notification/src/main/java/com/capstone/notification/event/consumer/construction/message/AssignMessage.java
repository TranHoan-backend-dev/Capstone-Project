package com.capstone.notification.event.consumer.construction.message;

public record AssignMessage(
  String pattern,
  AssignMessageData data
) {
  public record AssignMessageData(
    String formCode, String formNumber, String empId,
    Boolean status
  ) {

  }
}
