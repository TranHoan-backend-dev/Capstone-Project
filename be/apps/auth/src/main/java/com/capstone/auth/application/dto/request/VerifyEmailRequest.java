package com.capstone.auth.application.dto.request;

public record VerifyEmailRequest(String email, String token) {
}
