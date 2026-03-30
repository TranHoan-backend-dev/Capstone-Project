package com.capstone.auth.application.dto.request;

public record CredentialsRequest(
  String username,
  String password,
  String deviceId,
  String deviceInfo,
  String ipAddress
) {
}
