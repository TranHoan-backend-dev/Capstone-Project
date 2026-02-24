package com.capstone.construction.application.event.producer.road;

public record UpdateEvent(
  String oldName,
  String newName
) {
}
