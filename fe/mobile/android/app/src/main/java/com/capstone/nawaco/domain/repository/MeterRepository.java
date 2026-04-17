package com.capstone.nawaco.domain.repository;

import com.capstone.nawaco.domain.model.MeterReading;

import java.io.File;
import java.util.List;

public interface MeterRepository {
    boolean saveMeterReading(MeterReading reading) throws Exception;

    boolean updateManualMeterReading(String readingId, String serialNumber, double readingValue) throws Exception;

    File captureMeterImage() throws Exception;

    boolean validateImageQuality(File file) throws Exception;

    void submitToAiProcessing(MeterReading reading) throws Exception;

    List<MeterReading> getDailyReadings(long timestamp) throws Exception;
}
