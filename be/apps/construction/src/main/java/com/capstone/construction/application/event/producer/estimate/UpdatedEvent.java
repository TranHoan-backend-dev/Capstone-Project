package com.capstone.construction.application.event.producer.estimate;

public class UpdatedEvent extends BaseEvent{
  public UpdatedEvent(String customerName, Long formCode, Long formNumber, String surveyStaffName) {
    super(customerName, formCode, formNumber, surveyStaffName);
  }
}
