package com.capstone.notification.event.consumer.estimate.message;

public class UpdateEventMessage {
  public String pattern;
  public EstData data;

  public record EstData(
    String customerName,
    String formCode,
    String formNumber,
    String surveyStaffName
  ) {

  }
}
