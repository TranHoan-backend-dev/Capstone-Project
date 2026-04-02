package com.capstone.construction.application.event.producer.construction;

import lombok.Builder;

@Builder
public class BaseEvent {
  private String formCode;
  private String formNumber;
  private String constructionCaptain;
}
