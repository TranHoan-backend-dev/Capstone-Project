package com.capstone.auth.application.event.producer.message;

public record OtpEvent(
        String to,
        String subject,
        String template,
        String otp) {
}
