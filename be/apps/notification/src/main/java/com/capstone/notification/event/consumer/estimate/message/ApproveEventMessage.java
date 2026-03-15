package com.capstone.notification.event.consumer.estimate.message;

public class ApproveEventMessage {
  public String pattern;
  public EstData data;

  public record EstData(
    String customerName,
    String formCode,
    String formNumber,
    String surveyStaffName,
    Boolean status,
    String employeeId
  ) {

  }
}
