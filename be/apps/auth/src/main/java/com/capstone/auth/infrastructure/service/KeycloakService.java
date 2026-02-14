package com.capstone.auth.infrastructure.service;

import com.capstone.auth.application.dto.response.LoginResponse;
import com.capstone.common.annotation.AppLog;
import com.capstone.common.config.KeycloakProperties;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.slf4j.Logger;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@AppLog
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class KeycloakService {
  KeycloakProperties keycloakProperties;
  RestTemplate restTemplate;
  @NonFinal
  Logger log;

  public LoginResponse login(String username, String password) {
    log.info("Attempting login to Keycloak for user: {}", username);

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

    MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
    map.add("grant_type", "password");
    map.add("client_id", keycloakProperties.getClientId());
    map.add("client_secret", keycloakProperties.getClientSecret());
    map.add("username", username);
    map.add("password", password);
    // map.add("scope", keycloakConfig.getScope());
    map.add("scope", keycloakProperties.getScope());

    HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);

    try {
      ResponseEntity<LoginResponse> response = restTemplate.postForEntity(
        keycloakProperties.getTokenUri(),
        request,
        LoginResponse.class);
      return response.getBody();
    } catch (Exception e) {
      log.error("Login failed for user: {}", username, e);
      throw new IllegalArgumentException("Invalid credentials or Keycloak error");
    }
  }
}
