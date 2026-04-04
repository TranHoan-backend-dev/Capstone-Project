package com.capstone.auth.application.event.producer.message;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
public class AccountUpdateEvent extends BaseMessageEvent {
  private String fullName;
  private String departmentName;

  public AccountUpdateEvent(String to, String fullName, String departmentName, String subject, String template) {
    super(to, subject, template);
    this.fullName = fullName;
    this.departmentName = departmentName;
  }
}
