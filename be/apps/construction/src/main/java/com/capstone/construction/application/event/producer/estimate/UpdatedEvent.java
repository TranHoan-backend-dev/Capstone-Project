package com.capstone.construction.application.event.producer.estimate;

public record UpdatedEvent(
  String customerName,
  String formCode,
  String formNumber,
  String surveyStaffName
) {
}
