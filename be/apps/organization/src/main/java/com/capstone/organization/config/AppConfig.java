package com.capstone.organization.config;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
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

@RequiredArgsConstructor
@Configuration
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AppConfig {
  KeycloakConfig keycloakConfig;

  @Bean
  JwtDecoder jwtDecoder() {
    NimbusJwtDecoder decoder = JwtDecoders.fromIssuerLocation(keycloakConfig.getIssuerUri());
    OAuth2TokenValidator<Jwt> withIssuer = JwtValidators.createDefaultWithIssuer(keycloakConfig.getIssuerUri());
    OAuth2TokenValidator<Jwt> withAudience = new AudienceValidator(keycloakConfig.getAud());

    decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(withIssuer, withAudience));
    return decoder;
  }

  @Bean
  JwtAuthenticationConverter jwtAuthenticationConverter() {
    JwtAuthenticationConverter authenticationConverter = new JwtAuthenticationConverter();
    authenticationConverter.setJwtGrantedAuthoritiesConverter(jwt -> {
      Map<String, Object> realmAccess = jwt.getClaim("realm_access");
      if (realmAccess == null || realmAccess.isEmpty()) {
        return List.of();
      }

      @SuppressWarnings("unchecked")
      List<String> roles = (List<String>) realmAccess.get("roles");
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
