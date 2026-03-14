package com.capstone.construction.application.event.producer.estimate;

public class ApproveEvent extends BaseEvent {
  public ApproveEvent(String customerName, String formCode, String formNumber, String surveyStaffName) {
    super(customerName, formCode, formNumber, surveyStaffName);
  }
}
