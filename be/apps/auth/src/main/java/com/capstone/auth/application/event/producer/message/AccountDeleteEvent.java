package com.capstone.auth.application.event.producer.message;

public record AccountDeleteEvent(
  String fullName,
  String departmentName,
  String email,
  String subject,
  String template
) {
}
