package com.capstone.construction.application.event.producer;

import java.time.LocalDateTime;

public record InstallationFormCreatedEvent(
  String formNumber,
  String customerName,
  String formCode,
  String creator,
  LocalDateTime createdAt) {
}
