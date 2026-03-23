package com.capstone.auth.application.event.producer.message;

public record UpdatePasswordEvent(
  String to,
  String subject,
  String template,
  String fullName
) {
}
