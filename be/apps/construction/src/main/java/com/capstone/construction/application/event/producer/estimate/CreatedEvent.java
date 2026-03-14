package com.capstone.construction.application.event.producer.estimate;

public record CreatedEvent(
  String customerName,
  String formCode,
  String formNumber,
  String surveyStaffName
) {
}
