package com.capstone.construction.application.event.producer.commune;

public record UpdateEvent(
  String oldName,
  String newName,
  String oldType,
  String newType
) {
}
