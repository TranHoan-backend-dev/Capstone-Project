package com.capstone.auth.application.event.producer.message;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
public class OtpEvent extends BaseMessageEvent {
  private String name;
  private String otp;

  public OtpEvent(String to, String subject, String template, String name, String otp) {
    super(to, subject, template);
    this.name = name;
    this.otp = otp;
  }
}
