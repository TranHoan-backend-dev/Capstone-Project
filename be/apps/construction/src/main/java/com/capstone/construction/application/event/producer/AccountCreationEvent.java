package com.capstone.construction.application.event.producer;

public record AccountCreationEvent(
        String to, String subject,
        String template, String name,
        String username, String password) {

}
