package com.capstone.auth.application.dto.response;

public record CheckExistenceResponse(
        boolean isUsernameExists,
        boolean isEmailExists) {
}
