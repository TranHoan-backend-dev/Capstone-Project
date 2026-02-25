package com.capstone.construction.application.event.producer.unit;

public record UpdateEvent(
  String oldName,
  String oldCommune,
  String newName,
  String newCommune
) {
}
