package com.capstone.auth.application.usecase;

import com.capstone.auth.application.dto.response.LoginResponse;
import com.capstone.auth.infrastructure.service.KeycloakService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LoginUseCase {
    KeycloakService keycloakService;

    public LoginResponse login(String username, String password) {
        log.info("LoginUseCase handling login for user: {}", username);
        return keycloakService.login(username, password);
    }
}
