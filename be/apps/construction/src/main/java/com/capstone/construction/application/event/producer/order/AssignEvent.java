package com.capstone.construction.application.event.producer.order;

public record AssignEvent(
  String formCode, String formNumber, String empId
) {
}
