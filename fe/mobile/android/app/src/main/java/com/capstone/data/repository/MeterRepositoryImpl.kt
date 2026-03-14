package com.capstone.data.repository

import com.capstone.domain.model.MeterReading
import com.capstone.domain.repository.MeterRepository
import com.capstone.infrastructure.meter.MeterCaptureManager
import java.io.File
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class MeterRepositoryImpl @Inject constructor(
    private val captureManager: MeterCaptureManager
) : MeterRepository {

    private val localDb = mutableListOf<MeterReading>()

    override suspend fun captureMeterImage(): File? {
        // Logic chụp ảnh (Interaction with Camera API)
        // Code logic only: return a placeholder file
        return File("path/to/captured_meter.jpg")
    }

    override suspend fun validateImageQuality(file: File): Boolean {
        val isBlurred = captureManager.isImageBlurred(file)
        return !isBlurred
    }

    override suspend fun submitToAiProcessing(meterReading: MeterReading) {
        // TODO: Async process
        captureManager.sendToAiAsync(meterReading.imagePath)
        localDb.add(meterReading)
    }

    override suspend fun getDailyReadings(timestamp: Long): List<MeterReading> {
        // Lấy toàn bộ ảnh trong ngày kèm kết quả AI mock
        return localDb.map { reading ->
            if (reading.aiResult == null) {
                val mockResult = captureManager.getMockAiResults(reading.imagePath)
                reading.copy(
                    aiResult = MeterReading.AiResult(
                        serialNumber = mockResult["serialNumber"] as String,
                        readingValue = mockResult["readingValue"] as Double,
                        confidence = mockResult["confidence"] as Float
                    )
                )
            } else {
                reading
            }
        }
    }

    override suspend fun saveMeterReading(reading: MeterReading): Boolean {
        // Gọi API backend (Boundary)
        // TODO: Call backend API to save final reading
        println("Saving meter reading to DB: ${reading.serialNumber} - ${reading.readingValue}")
        return true
    }
}
