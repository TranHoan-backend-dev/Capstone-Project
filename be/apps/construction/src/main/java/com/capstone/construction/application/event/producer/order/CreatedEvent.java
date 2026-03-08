package com.capstone.construction.application.event.producer.order;

public record CreatedEvent(
  String formNumber,
  String customerName,
  String formCode,
  String creator,
  String createdAt) {
}
