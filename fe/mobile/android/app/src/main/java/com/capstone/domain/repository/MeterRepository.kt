package com.capstone.domain.repository

import com.capstone.domain.model.MeterReading
import java.io.File

interface MeterRepository {
    /**
     * Chụp ảnh đồng hồ nước.
     */
    suspend fun captureMeterImage(): File?

    /**
     * Kiểm tra chất lượng ảnh (mờ đục, đủ tiêu chuẩn).
     * @return true nếu ảnh đạt yêu cầu, false nếu mờ/không đạt.
     */
    suspend fun validateImageQuality(file: File): Boolean

    /**
     * Gửi sự kiện bất đồng bộ cho AI xử lý.
     */
    suspend fun submitToAiProcessing(meterReading: MeterReading)

    /**
     * Lấy danh sách ảnh và kết quả AI trong ngày.
     */
    suspend fun getDailyReadings(timestamp: Long): List<MeterReading>

    /**
     * Lưu chỉ số nước vào database sau khi người dùng xác nhận hoặc nhập tay.
     */
    suspend fun saveMeterReading(reading: MeterReading): Boolean
}
