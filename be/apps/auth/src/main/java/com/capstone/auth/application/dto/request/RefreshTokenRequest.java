package com.capstone.auth.application.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

public record RefreshTokenRequest(
  @Schema(description = "Refresh token")
  String token
) {
}
