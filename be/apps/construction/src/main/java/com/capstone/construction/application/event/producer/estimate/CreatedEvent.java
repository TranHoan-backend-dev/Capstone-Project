package com.capstone.construction.application.event.producer.estimate;

public class CreatedEvent extends BaseEvent{
  public CreatedEvent(String customerName, String formCode, String formNumber, String surveyStaffName) {
    super(customerName, formCode, formNumber, surveyStaffName);
  }
}
