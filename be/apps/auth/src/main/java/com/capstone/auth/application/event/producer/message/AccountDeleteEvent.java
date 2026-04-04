package com.capstone.auth.application.event.producer.message;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
public class AccountDeleteEvent extends BaseMessageEvent {
  private String fullName;
  private String departmentName;
  private String email;

  public AccountDeleteEvent(String to, String fullName, String departmentName, String email, String subject, String template) {
    super(to, subject, template);
    this.fullName = fullName;
    this.departmentName = departmentName;
    this.email = email;
  }
}
