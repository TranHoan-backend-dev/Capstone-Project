package com.capstone.notification.event.consumer.calculationunit.message;

public record DeleteUnitEventMessage(
        String pattern,
        UnitEventData data) {
    public record UnitEventData(
            String name) {
    }
}
