package com.capstone.auth.application.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public record LoginResponse(
        @JsonProperty("access_token") String accessToken,

        @JsonProperty("expires_in") Long expiresIn,

        @JsonProperty("refresh_expires_in") Long refreshExpiresIn,

        @JsonProperty("refresh_token") String refreshToken,

        @JsonProperty("token_type") String tokenType,

        @JsonProperty("not-before-policy") Integer notBeforePolicy,

        @JsonProperty("session_state") String sessionState,

        @JsonProperty("scope") String scope) {
}
