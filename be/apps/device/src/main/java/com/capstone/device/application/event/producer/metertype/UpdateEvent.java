package com.capstone.device.application.event.producer.metertype;

public record UpdateEvent(
  String oldName,
  String oldOrigin,
  String oldMeterModel,
  Integer oldSize,
  String oldMaxIndex,
  String oldQn,
  String oldQt,
  String oldQmin,
  Float oldDiameter,
  String newName,
  String newOrigin,
  String newMeterModel,
  Integer newSize,
  String newMaxIndex,
  String newQn,
  String newQt,
  String newQmin,
  Float newDiameter) {
}
