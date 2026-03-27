package com.capstone.auth.application.dto.response;

public record TokenResponse(
  UserProfileResponse userDetails,
  TokenExchangeResponse token
) {
}
