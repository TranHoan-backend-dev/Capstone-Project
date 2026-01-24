package com.capstone.auth.infrastructure.config;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;

@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AudienceValidator implements OAuth2TokenValidator<Jwt> {
  String audience;

  public AudienceValidator(String audience) {
    this.audience = audience;
  }

  @Override
  public OAuth2TokenValidatorResult validate(@NonNull Jwt token) {
    if (token.getAudience().contains(audience)) {
      return OAuth2TokenValidatorResult.success();
    }
    return OAuth2TokenValidatorResult.failure(
      new OAuth2Error("invalid_token", "The token audience does not match the required audience", null)
    );
  }
}
