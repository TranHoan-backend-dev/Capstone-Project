package com.capstone.construction.application.event.producer;

public record LateralEvent(
  String oldName,
  String newName,
  String oldNetwork,
  String newNetwork
) {
}
