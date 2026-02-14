package com.capstone.common.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;

@Slf4j
public class AuthorizedPartyValidator implements OAuth2TokenValidator<Jwt> {
  private final String clientId;

  public AuthorizedPartyValidator(String clientId) {
    this.clientId = clientId;
  }

  @Override
  public OAuth2TokenValidatorResult validate(Jwt token) {
    log.info("Validating azp for client id: {}", clientId);
    var azp = token.getClaimAsString("azp");
    if (clientId.equals(azp)) {
      return OAuth2TokenValidatorResult.success();
    }
    return OAuth2TokenValidatorResult.failure(
      new OAuth2Error("invalid_token", "Invalid azp", null));
  }
}
