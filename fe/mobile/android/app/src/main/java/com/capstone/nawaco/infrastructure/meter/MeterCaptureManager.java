package com.capstone.infrastructure.meter;

import android.util.Log;

import androidx.annotation.NonNull;

import java.io.File;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import javax.inject.Inject;
import javax.inject.Singleton;

@Singleton
public class MeterCaptureManager {
    private final Random random = new Random();

    /**
     * Logic kiểm tra độ mờ của ảnh đồng hồ (mô phỏng).
     */
    public boolean isImageBlurred(@NonNull File file) {
        // Mô phỏng logic kiểm tra nếu file quá nhỏ hoặc không hợp lệ
        return file.length() < 1024;
    }

    /**
     * Gửi yêu cầu phân tích hình ảnh AI theo cách bất đồng bộ (mô phỏng).
     */
    public void sendToAiAsync(String imagePath) {
        Log.i(this.getClass().getName(), "Sending image to AI asynchronously: " + imagePath);
    }

    /**
     * Mô phỏng kết quả AI trả về khi nhận diện chỉ số và số sê-ri đồng hồ.
     */
    public Map<String, Object> getMockAiResults(String imagePath) {
        Map<String, Object> results = new HashMap<>();
        results.put("serialNumber", "WT-" + (1000 + random.nextInt(9000)));
        results.put("readingValue", 100.0 + random.nextInt(400) + random.nextInt(10) * 0.1);
        results.put("confidence", 0.95f);
        return results;
    }
}
