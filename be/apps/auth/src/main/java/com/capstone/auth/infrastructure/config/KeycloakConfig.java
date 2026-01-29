package com.capstone.auth.infrastructure.config;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.springframework.boot.context.properties.ConfigurationProperties;
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
}
