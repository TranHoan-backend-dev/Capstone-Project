package com.capstone.domain.usecase

import com.capstone.domain.model.MeterReading
import com.capstone.domain.repository.MeterRepository
import java.io.File
import javax.inject.Inject

class VerifyMeterReadingUseCase @Inject constructor(
    private val meterRepository: MeterRepository
) {
    /**
     * Chụp ảnh và kiểm tra chất lượng.
     */
    suspend fun processCapture(): Result<MeterReading> {
        val file = meterRepository.captureMeterImage() ?: return Result.failure(Exception("Capture failed"))
        
        val isValid = meterRepository.validateImageQuality(file)
        if (!isValid) {
            return Result.failure(Exception("Ảnh bị mờ hoặc không đủ tiêu chuẩn. Vui lòng chụp lại."))
        }

        val reading = MeterReading(
            imagePath = file.absolutePath,
            status = MeterReading.Status.PENDING
        )

        meterRepository.submitToAiProcessing(reading)
        return Result.success(reading)
    }

    /**
     * Duyệt qua danh sách ảnh cuối ngày.
     */
    suspend fun getReadingsForReview(): List<MeterReading> {
        return meterRepository.getDailyReadings(System.currentTimeMillis())
    }

    /**
     * Xác nhận hoặc nhập lại chỉ số nước.
     */
    suspend fun finalizeReading(
        reading: MeterReading,
        isApproved: Boolean,
        manualValue: Double? = null,
        manualSerial: String? = null
    ): Boolean {
        val finalReading = if (isApproved && reading.aiResult != null) {
            reading.copy(
                serialNumber = reading.aiResult.serialNumber,
                readingValue = reading.aiResult.readingValue,
                status = MeterReading.Status.COMPLETED
            )
        } else {
            reading.copy(
                serialNumber = manualSerial ?: reading.serialNumber,
                readingValue = manualValue ?: reading.readingValue,
                status = MeterReading.Status.VALIDATED
            )
        }

        return meterRepository.saveMeterReading(finalReading)
    }
}
