package com.capstone.construction.application.event.producer.estimate;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public abstract class BaseEvent {
  protected String customerName;
  protected String formCode;
  protected String formNumber;
  protected String surveyStaffName;
}
