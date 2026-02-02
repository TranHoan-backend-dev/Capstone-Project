package com.capstone.auth.infrastructure.config;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AudienceValidator implements OAuth2TokenValidator<Jwt> {
  List<String> audiences;

  @Override
  public OAuth2TokenValidatorResult validate(@NonNull Jwt token) {
    boolean matched = token.getAudience()
      .stream()
      .anyMatch(audiences::contains);

    if (matched) {
      return OAuth2TokenValidatorResult.success();
    }

    return OAuth2TokenValidatorResult.failure(
      new OAuth2Error(
        "invalid_token",
        "Token audience is not allowed",
        null
      )
    );
  }
}
