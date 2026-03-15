package com.capstone.infrastructure.meter

import android.content.Context
import java.io.File
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class MeterCaptureManager @Inject constructor(
    private val context: Context
) {
    /**
     * Logic kiểm tra ảnh mờ đục.
     * Hiện tại return true giả định ảnh luôn tốt, hoặc logic mock.
     */
    fun isImageBlurred(file: File): Boolean {
        // TODO: Implement actual blur detection using OpenCV or CameraX APIs
        // For now, mockup logic:
        return file.length() < 1024 // Giả định file quá nhỏ là lỗi hoặc mờ
    }

    /**
     * Logic gửi sự kiện cho AI xử lý.
     */
    fun sendToAiAsync(imagePath: String) {
        // TODO: Gửi sự kiện qua Message Queue hoặc WorkManager
        println("Sending image to AI asynchronously: $imagePath")
    }

    /**
     * Mock dữ liệu kết quả AI trả về vào cuối ngày.
     */
    fun getMockAiResults(imagePath: String): Map<String, Any> {
        return mapOf(
            "serialNumber" to "WT-" + (1000..9999).random(),
            "readingValue" to (100..500).random().toDouble() + (0..9).random() * 0.1,
            "confidence" to 0.95f
        )
    }
}
