package com.capstone.auth.application.event.producer;

public record OtpEvent(
        String to,
        String subject,
        String template,
        String otp) {
}
