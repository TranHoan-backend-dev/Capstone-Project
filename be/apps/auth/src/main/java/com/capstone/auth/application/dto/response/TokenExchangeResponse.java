package com.capstone.auth.application.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Auth response from Keycloak after successful login")
public record TokenExchangeResponse(
  @Schema(description = "Access token used to access secured resources")
  @JsonProperty("access_token") String accessToken,

  @Schema(description = "Access token expiration time (seconds)")
  @JsonProperty("expires_in") Long expiresIn,

  @Schema(description = "Refresh token expiration time (seconds)")
  @JsonProperty("refresh_expires_in") Long refreshExpiresIn,

  @Schema(description = "Token used to obtain a new access token")
  @JsonProperty("refresh_token") String refreshToken,

  @Schema(description = "Token type (usually Bearer)")
  @JsonProperty("token_type") String tokenType,

  @Schema(description = "Not before policy")
  @JsonProperty("not-before-policy") Integer notBeforePolicy,

  @Schema(description = "Session state identifier")
  @JsonProperty("session_state") String sessionState,

  @Schema(description = "Granted scopes")
  @JsonProperty("scope") String scope) {
}
