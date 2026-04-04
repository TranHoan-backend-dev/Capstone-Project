package com.capstone.auth.application.event.producer.message;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
public class NewDeviceLoginEvent extends BaseMessageEvent {
  private String name;
  private String deviceName;
  private String loginTime;
  private String ipAddress;

  public NewDeviceLoginEvent(String to, String subject, String template, String name, String deviceName, String loginTime, String ipAddress) {
    super(to, subject, template);
    this.name = name;
    this.deviceName = deviceName;
    this.loginTime = loginTime;
    this.ipAddress = ipAddress;
  }
}
