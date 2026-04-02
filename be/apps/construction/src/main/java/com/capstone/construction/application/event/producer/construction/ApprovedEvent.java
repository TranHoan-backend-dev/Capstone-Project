package com.capstone.construction.application.event.producer.construction;

public class ApprovedEvent extends BaseEvent {
  public ApprovedEvent(String formCode, String formNumber, String constructionCaptain) {
    super(formCode, formNumber, constructionCaptain);
  }
}
