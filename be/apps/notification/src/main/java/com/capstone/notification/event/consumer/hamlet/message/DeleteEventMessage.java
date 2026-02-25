package com.capstone.notification.event.consumer.hamlet.message;

public record DeleteEventMessage(
  String pattern,
  HamletEventData data) {
  public record HamletEventData(
    String name,
    String type,
    String commune) {

  }
}
