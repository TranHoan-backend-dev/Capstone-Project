package com.capstone.bridge;

import com.capstone.domain.model.MeterReading;
import com.capstone.domain.repository.MeterRepository;
import com.capstone.infrastructure.security.PermissionManager;
import com.facebook.react.bridge.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MeterBridgeModule extends ReactContextBaseJavaModule {
    private final MeterRepository meterRepository;
    private final PermissionManager permissionManager;
    private final ExecutorService executorService;

    public MeterBridgeModule(ReactApplicationContext reactContext, 
                             MeterRepository meterRepository, 
                             PermissionManager permissionManager) {
        super(reactContext);
        this.meterRepository = meterRepository;
        this.permissionManager = permissionManager;
        this.executorService = Executors.newFixedThreadPool(4);
    }

    @Override
    public String getName() {
        return "MeterModule";
    }

    @ReactMethod
    public void saveMeterReading(final ReadableMap readingMap, final Promise promise) {
        if (!permissionManager.canAccessFullFeatures()) {
            promise.reject("ACCESS_DENIED", "Bạn không có quyền thực hiện chức năng này");
            return;
        }

        executorService.execute(() -> {
            try {
                MeterReading reading = new MeterReading(
                    readingMap.getString("id") != null ? readingMap.getString("id") : "",
                    readingMap.getString("serialNumber") != null ? readingMap.getString("serialNumber") : "",
                    readingMap.getDouble("readingValue"),
                    readingMap.getString("imagePath") != null ? readingMap.getString("imagePath") : ""
                );
                boolean success = meterRepository.saveMeterReading(reading);
                promise.resolve(success);
            } catch (Exception e) {
                promise.reject("SAVE_METER_ERROR", e.getMessage(), e);
            }
        });
    }

    @ReactMethod
    public void updateManualMeterReading(final String readingId, final String serialNumber, final double readingValue, final Promise promise) {
        if (!permissionManager.canAccessFullFeatures()) {
            promise.reject("ACCESS_DENIED", "Bạn không có quyền thực hiện chức năng này");
            return;
        }

        executorService.execute(() -> {
            try {
                boolean success = meterRepository.updateManualMeterReading(readingId, serialNumber, readingValue);
                promise.resolve(success);
            } catch (Exception e) {
                promise.reject("UPDATE_MANUAL_ERROR", e.getMessage(), e);
            }
        });
    }
}
