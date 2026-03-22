package com.capstone.data.repository;

import android.util.Log;

import androidx.annotation.NonNull;

import com.capstone.domain.model.MeterReading;
import com.capstone.domain.repository.MeterRepository;
import com.capstone.infrastructure.meter.MeterCaptureManager;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.inject.Singleton;

@Singleton
public class MeterRepositoryImpl implements MeterRepository {
    private final MeterCaptureManager captureManager;
    private final List<MeterReading> localDb = new ArrayList<>();

    @Inject
    public MeterRepositoryImpl(MeterCaptureManager captureManager) {
        this.captureManager = captureManager;
    }

    @Override
    public File captureMeterImage() throws Exception {
        // Mocking capture logic
        return new File("path/to/captured_meter.jpg");
    }

    @Override
    public boolean validateImageQuality(File file) throws Exception {
        var isBlurred = captureManager.isImageBlurred(file);
        return !isBlurred;
    }

    @Override
    public void submitToAiProcessing(@NonNull MeterReading meterReading) throws Exception {
        captureManager.sendToAiAsync(meterReading.getImagePath());
        localDb.add(meterReading);
    }

    @Override
    public List<MeterReading> getDailyReadings(long timestamp) throws Exception {
        List<MeterReading> results = new ArrayList<>();
        for (var reading : localDb) {
            if (reading.getAiResult() == null) {
                Map<String, Object> mockResult = captureManager.getMockAiResults(reading.getImagePath());
                results.add(new MeterReading(
                        reading.getId(),
                        (String) mockResult.get("serialNumber"),
                        (Double) mockResult.get("readingValue"),
                        reading.getImagePath(),
                        reading.getStatus(),
                        new MeterReading.AiResult(
                                (String) mockResult.get("serialNumber"),
                                (Double) mockResult.get("readingValue")
                                // Confidence field was used in Kotlin but omitted in my simplified Java model,
                                // I'll stick to what I defined in MeterReading.java
                        )
                ));
            } else {
                results.add(reading);
            }
        }
        return results;
    }

    @Override
    public boolean saveMeterReading(@NonNull MeterReading reading) throws Exception {
        Log.i(this.getClass().getName(), "Saving meter reading to DB: " + reading.getSerialNumber() + " - " + reading.getReadingValue());
        return true;
    }

    @Override
    public boolean updateManualMeterReading(String readingId, String serialNumber, double readingValue) throws Exception {
        for (var i = 0; i < localDb.size(); i++) {
            var old = localDb.get(i);
            if (old.getId().equals(readingId)) {
                localDb.set(i, old.copy(serialNumber, readingValue, old.getStatus()));
                break;
            }
        }
        Log.i(this.getClass().getName(), "Manually updated reading for " + readingId + ": " + serialNumber + " - " + readingValue);
        return true;
    }
}
