package com.capstone.construction.application.event.producer.receipt;

public record ApprovedEvent(
  String formCode,
  String formNumber,
  String constructionCaptain
) {
}
