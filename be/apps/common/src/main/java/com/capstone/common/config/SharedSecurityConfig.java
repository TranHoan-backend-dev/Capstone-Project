package com.capstone.common.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;

import java.util.List;
import java.util.Map;

@Slf4j
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

  @Bean
  JwtAuthenticationConverter jwtAuthenticationConverter() {
    var authenticationConverter = new JwtAuthenticationConverter();
    authenticationConverter.setJwtGrantedAuthoritiesConverter(jwt -> {
      Map<String, Object> realmAccess = jwt.getClaim("realm_access");
      log.info("realmAccess: {}", realmAccess);
      if (realmAccess == null || realmAccess.isEmpty()) {
        return List.of();
      }

      @SuppressWarnings("unchecked")
      List<String> roles = (List<String>) realmAccess.get("roles");
      log.info("roles: {}", roles);
      if (roles == null || roles.isEmpty()) {
        return List.of();
      }

      return roles.stream()
        .map(SimpleGrantedAuthority::new)
        .map(GrantedAuthority.class::cast)
        .toList();
    });
    return authenticationConverter;
  }
}
