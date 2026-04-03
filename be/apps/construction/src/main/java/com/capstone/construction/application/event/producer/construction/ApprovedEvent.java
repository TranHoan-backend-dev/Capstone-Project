package com.capstone.construction.application.event.producer.construction;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ApprovedEvent extends BaseEvent {
  public ApprovedEvent(String formCode, String formNumber, String constructionCaptain) {
    super(formCode, formNumber, constructionCaptain);
  }
}
