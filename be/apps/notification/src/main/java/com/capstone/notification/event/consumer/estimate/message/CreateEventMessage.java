package com.capstone.notification.event.consumer.estimate.message;

public record CreateEventMessage(
  String pattern,
  EstData data
) {
  public record EstData(
    String customerName,
    String formCode,
    String formNumber,
    String surveyStaffName
  ) {

  }
}
