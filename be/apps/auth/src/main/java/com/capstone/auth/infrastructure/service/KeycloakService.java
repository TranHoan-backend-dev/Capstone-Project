package com.capstone.auth.infrastructure.service;

import com.capstone.auth.application.dto.response.LoginResponse;
import com.capstone.auth.infrastructure.config.KeycloakConfig;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class KeycloakService {
    KeycloakConfig keycloakConfig;
    RestTemplate restTemplate;

    public LoginResponse login(String username, String password) {
        log.info("Attempting login to Keycloak for user: {}", username);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("grant_type", "password");
        map.add("client_id", keycloakConfig.getClientId());
        map.add("client_secret", keycloakConfig.getClientSecret());
        map.add("username", username);
        map.add("password", password);
        map.add("scope", keycloakConfig.getScope());

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);

        try {
            ResponseEntity<LoginResponse> response = restTemplate.postForEntity(
                    keycloakConfig.getTokenUri(),
                    request,
                    LoginResponse.class);
            return response.getBody();
        } catch (Exception e) {
            log.error("Login failed for user: {}", username, e);
            throw new IllegalArgumentException("Invalid credentials or Keycloak error");
        }
    }
}
