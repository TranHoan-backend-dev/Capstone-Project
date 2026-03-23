package com.capstone.construction.application.event.producer.estimate;

import lombok.Getter;

@Getter
public class ApproveEvent extends BaseEvent {
  public String employeeId;
  public Boolean status;

  public ApproveEvent(String customerName, String formCode, String formNumber, String surveyStaffName, Boolean status, String employeeId) {
    super(customerName, formCode, formNumber, surveyStaffName);
    this.employeeId = employeeId;
    this.status = status;
  }
}
