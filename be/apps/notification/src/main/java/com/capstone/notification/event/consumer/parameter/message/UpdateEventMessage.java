package com.capstone.notification.event.consumer.parameter.message;

public record UpdateEventMessage(
  String pattern,
  ParameterData data) {
  public record ParameterData(
    String oldName,
    String oldValue,
    String newName,
    String newValue) {
  }
}
