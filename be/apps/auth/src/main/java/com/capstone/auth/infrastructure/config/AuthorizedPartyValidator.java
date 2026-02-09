package com.capstone.auth.infrastructure.config;

import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class AuthorizedPartyValidator implements OAuth2TokenValidator<Jwt> {
  @Value("${keycloak.client-id}")
  private String clientId;

  @Override
  public OAuth2TokenValidatorResult validate(@NonNull Jwt token) {
    log.info("Client id: {}", clientId);
    var azp = token.getClaimAsString("azp");
    if (clientId.equals(azp)) {
      return OAuth2TokenValidatorResult.success();
    }
    return OAuth2TokenValidatorResult.failure(
      new OAuth2Error("invalid_token", "Invalid azp", null)
    );
  }
}
