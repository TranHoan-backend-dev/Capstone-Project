package com.capstone.construction.application.event.producer.lateral;

public record UpdateLateralEvent(
  String oldName,
  String newName,
  String oldNetwork,
  String newNetwork
) {
}
