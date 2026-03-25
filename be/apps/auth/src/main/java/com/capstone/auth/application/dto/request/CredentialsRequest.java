package com.capstone.auth.application.dto.request;

public record CredentialsRequest(
  String username,
  String password
) {
}
