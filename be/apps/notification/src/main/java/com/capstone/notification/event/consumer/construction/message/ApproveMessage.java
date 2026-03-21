package com.capstone.notification.event.consumer.construction.message;

public record ApproveMessage(
  String pattern,
  ApprovedConstructionMessage data
) {
  public record ApprovedConstructionMessage(
    String formCode,
    String formNumber,
    String constructionCaptain
  ) {

  }
}
