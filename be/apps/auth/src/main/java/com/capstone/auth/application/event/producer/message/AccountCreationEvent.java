package com.capstone.auth.application.event.producer.message;

public record AccountCreationEvent(
  String to, String subject,
  String template, String name,
  String username, String password) {

}
