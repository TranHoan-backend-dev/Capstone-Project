package com.capstone.device.application.event.producer.parameter;

public record ParameterUpdateEvent(
  String oldName,
  String oldValue,
  String newName,
  String newValue) {
}
