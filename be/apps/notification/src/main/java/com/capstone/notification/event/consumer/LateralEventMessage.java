package com.capstone.notification.event.consumer;

public record LateralEventMessage(
  String pattern,
  LateralEventData data
) {
  public record LateralEventData(
    String oldName,
    String newName,
    String oldNetwork,
    String newNetwork
  ) {
  }
}
