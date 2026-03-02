package com.capstone.device.application.event.producer.metertype;

public record DeleteEvent(
  String name,
  String origin,
  String meterModel,
  Integer size,
  String maxIndex,
  String qn,
  String qt,
  String qmin,
  Float diameter) {
}
