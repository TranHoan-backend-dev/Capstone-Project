package com.capstone.auth.application.business.dto;

public record UserDTO(String role, String username, String email, boolean isLocked, boolean isEnabled) {
}
