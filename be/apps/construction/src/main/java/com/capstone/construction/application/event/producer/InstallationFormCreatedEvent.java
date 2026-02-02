package com.capstone.construction.application.event.producer;

import java.time.LocalDateTime;

public record InstallationFormCreatedEvent(
        String formNumber,
        String customerName,
        String address,
        String phoneNumber,
        LocalDateTime createdAt) {
}
