package com.capstone.domain.repository;

import com.capstone.domain.model.MeterReading;

public interface MeterRepository {
    boolean saveMeterReading(MeterReading reading) throws Exception;
    boolean updateManualMeterReading(String readingId, String serialNumber, double readingValue) throws Exception;
}
