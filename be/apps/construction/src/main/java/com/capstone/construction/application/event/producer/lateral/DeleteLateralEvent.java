package com.capstone.construction.application.event.producer.lateral;

public record DeleteLateralEvent(
  String name,
  String network
) {
}
