package com.capstone.construction.application.event.producer.order;

public record RejectEvent(
  String empId, // order receiving staff id
  String formCode,
  String formNumber,
  String customerName
) {
}
