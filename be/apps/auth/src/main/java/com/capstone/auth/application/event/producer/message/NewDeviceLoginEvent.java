package com.capstone.auth.application.event.producer.message;

public record NewDeviceLoginEvent(
    String email,
    String subject,
    String template,
    String name,
    String deviceName,
    String loginTime,
    String ipAddress
) {
}
