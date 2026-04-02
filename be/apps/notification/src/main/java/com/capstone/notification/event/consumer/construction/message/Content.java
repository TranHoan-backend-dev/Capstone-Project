package com.capstone.notification.event.consumer.construction.message;

public record Content(
  String formCode,
  String formNumber,
  String constructionCaptain
) {
}
