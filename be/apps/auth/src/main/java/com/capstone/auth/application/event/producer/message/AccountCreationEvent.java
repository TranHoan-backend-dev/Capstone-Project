package com.capstone.auth.application.event.producer.message;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
public class AccountCreationEvent extends BaseMessageEvent {
  private String name;
  private String username;
  private String password;

  public AccountCreationEvent(String to, String subject, String template, String name, String username, String password) {
    super(to, subject, template);
    this.name = name;
    this.username = username;
    this.password = password;
  }
}
