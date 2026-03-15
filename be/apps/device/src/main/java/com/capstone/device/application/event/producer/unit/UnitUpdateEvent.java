package com.capstone.device.application.event.producer.unit;

public record UnitUpdateEvent(
        String oldName,
        String newName) {
}
