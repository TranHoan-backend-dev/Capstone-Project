package com.capstone.auth.application.dto.request;

public record CheckExistenceRequest(
        String username,
        String email) {
}
