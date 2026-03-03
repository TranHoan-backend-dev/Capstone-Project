package com.capstone.construction.application.event.producer.hamlet;

public record DeleteHamletEvent(
  String name,
  String type,
  String commune
) {
}
