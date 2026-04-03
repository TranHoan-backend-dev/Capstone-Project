package com.capstone.construction.application.event.producer.construction;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UpdateEvent extends BaseEvent {
  public UpdateEvent(String formCode, String formNumber, String constructionCaptain) {
    super(formCode, formNumber, constructionCaptain);
  }
}
