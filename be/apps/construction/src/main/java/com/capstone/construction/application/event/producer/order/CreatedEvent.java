package com.capstone.construction.application.event.producer.order;

import java.time.LocalDateTime;

public record CreatedEvent(
  String formNumber,
  String customerName,
  String formCode,
  String creator,
  LocalDateTime createdAt) {
}
