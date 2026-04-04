package com.capstone.auth.application.event.producer.message;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
public class UpdatePasswordEvent extends BaseMessageEvent {
  private String fullName;

  public UpdatePasswordEvent(String to, String subject, String template, String fullName) {
    super(to, subject, template);
    this.fullName = fullName;
  }
}
