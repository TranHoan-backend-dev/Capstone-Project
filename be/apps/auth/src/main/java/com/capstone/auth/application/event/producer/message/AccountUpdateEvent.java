package com.capstone.auth.application.event.producer.message;

public record AccountUpdateEvent(
  String fullName,
  String departmentName,
  String subject,
  String template
) {
}
