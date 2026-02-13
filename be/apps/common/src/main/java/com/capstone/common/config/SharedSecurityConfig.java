package com.capstone.common.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.*;

@Configuration
@RequiredArgsConstructor
@EnableConfigurationProperties(KeycloakProperties.class)
public class SharedSecurityConfig {
  private final KeycloakProperties keycloakProperties;

  @Bean
  public JwtDecoder jwtDecoder() {
    NimbusJwtDecoder decoder = JwtDecoders.fromIssuerLocation(keycloakProperties.getIssuerUri());
    OAuth2TokenValidator<Jwt> withIssuer = JwtValidators.createDefaultWithIssuer(keycloakProperties.getIssuerUri());
    OAuth2TokenValidator<Jwt> withAudience = new AudienceValidator(keycloakProperties.getAud());
    OAuth2TokenValidator<Jwt> withAzp = new AuthorizedPartyValidator(keycloakProperties.getClientId());

    decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(
      withIssuer,
      withAudience,
      withAzp));
    return decoder;
  }
}
