package com.capstone.auth.application.business.dto;

import java.time.LocalDateTime;

public record UserDTO(
    String role,
    String username,
    String email,
    boolean isLocked,
    String password,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    String lockedReason,
    LocalDateTime lockedAt,
    String jobId,
    String departmentId,
    String waterSupplyNetworkId,
    String electronicSigningUrl,
    boolean isEnabled) {
}
