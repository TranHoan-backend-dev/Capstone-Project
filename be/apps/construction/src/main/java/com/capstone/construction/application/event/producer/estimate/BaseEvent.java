package com.capstone.construction.application.event.producer.estimate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
public abstract class BaseEvent {
  protected String customerName;
  protected Long formCode;
  protected Long formNumber;
  protected String surveyStaffName;
}
