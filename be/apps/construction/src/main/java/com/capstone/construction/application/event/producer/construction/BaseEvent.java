package com.capstone.construction.application.event.producer.construction;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class BaseEvent {
  private String formCode;
  private String formNumber;
  private String constructionCaptain;
}
