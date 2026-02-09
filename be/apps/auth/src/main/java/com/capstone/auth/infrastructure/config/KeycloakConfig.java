package com.capstone.auth.infrastructure.config;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Data
@Configuration
@ConfigurationProperties(prefix = "keycloak")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class KeycloakConfig {
  String issuerUri;
  String tokenUri;
  String clientId;
  String clientSecret;
  String scope;
  List<String> aud;
  String serverUrl;
  String username;
  String password;

  @Bean
  public Keycloak keycloak() {
    return KeycloakBuilder.builder()
      .serverUrl(serverUrl)
      .realm("master")
      .clientId("admin-cli")
      .username(username)
      .password(password)
      .grantType(OAuth2Constants.PASSWORD)
      .build();
  }
}
