package com.capstone.construction.application.event.producer.hamlet;

public record UpdateHamletEvent(
  String oldName,
  String oldType,
  String oldCommune,
  String newName,
  String newType,
  String newCommune
) {
}
