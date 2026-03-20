package com.capstone.domain.model;

import androidx.annotation.Nullable;

public class MeterReading {
    public enum Status {
        PENDING,
        COMPLETED,
        VALIDATED
    }

    public static class AiResult {
        private final String serialNumber;
        private final double readingValue;

        public AiResult(String serialNumber, double readingValue) {
            this.serialNumber = serialNumber;
            this.readingValue = readingValue;
        }

        public String getSerialNumber() { return serialNumber; }
        public double getReadingValue() { return readingValue; }
    }

    private final String id;
    private final String serialNumber;
    private final double readingValue;
    private final String imagePath;
    private final Status status;
    private final AiResult aiResult;

    public MeterReading(String id, String serialNumber, double readingValue, String imagePath, Status status, @Nullable AiResult aiResult) {
        this.id = id;
        this.serialNumber = serialNumber;
        this.readingValue = readingValue;
        this.imagePath = imagePath;
        this.status = status;
        this.aiResult = aiResult;
    }

    // Convenience constructor for new readings
    public MeterReading(String imagePath, Status status) {
        this("", "", 0.0, imagePath, status, null);
    }

    public String getId() { return id != null ? id : ""; }
    public String getSerialNumber() { return serialNumber != null ? serialNumber : ""; }
    public double getReadingValue() { return readingValue; }
    public String getImagePath() { return imagePath != null ? imagePath : ""; }
    public Status getStatus() { return status; }
    @Nullable public AiResult getAiResult() { return aiResult; }

    /**
     * Helper to simulate data class copy functionality.
     */
    public MeterReading copy(String serialNumber, double readingValue, Status status) {
        return new MeterReading(this.id, serialNumber, readingValue, this.imagePath, status, this.aiResult);
    }
}
