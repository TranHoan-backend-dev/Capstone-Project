package com.capstone.construction.application.event.producer.order;

public record ApproveEvent(
  String empId,
  String formCode,
  String formNumber,
  String creator,
  String customerName,
  String createdAt
) {
}
