package com.capstone.notification.event.consumer.calculationunit.message;

public record UpdateParameterEventMessage(
        String pattern,
        ParameterData data) {
    public record ParameterData(
            String oldName,
            String oldValue,
            String newName,
            String newValue) {
    }
}
