package com.capstone.bridge

import com.capstone.domain.model.MeterReading
import com.capstone.domain.repository.MeterRepository
import com.facebook.react.bridge.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import com.capstone.infrastructure.security.PermissionManager

class MeterBridgeModule(
    reactContext: ReactApplicationContext,
    private val meterRepository: MeterRepository,
    private val permissionManager: PermissionManager
) : ReactContextBaseJavaModule(reactContext) {

    private val scope = CoroutineScope(Dispatchers.IO)

    override fun getName(): String = "MeterModule"

    /**
     * Lưu chỉ số đồng hồ sau khi đã xác nhận hoặc cập nhật thủ công.
     * Luồng: JavaScript -> MeterModule -> Repository -> API Backend
     */
    @ReactMethod
    fun saveMeterReading(readingMap: ReadableMap, promise: Promise) {
        if (!permissionManager.canAccessFullFeatures()) {
            promise.reject("ACCESS_DENIED", "Bạn không có quyền thực hiện chức năng này")
            return
        }
        scope.launch {
            try {
                val reading = MeterReading(
                    id = readingMap.getString("id") ?: "",
                    serialNumber = readingMap.getString("serialNumber") ?: "",
                    readingValue = readingMap.getDouble("readingValue"),
                    imagePath = readingMap.getString("imagePath") ?: ""
                )
                val success = meterRepository.saveMeterReading(reading)
                promise.resolve(success)
            } catch (e: Exception) {
                promise.reject("SAVE_METER_ERROR", e.message, e)
            }
        }
    }

    /**
     * Cập nhật thủ công chỉ số và số seri nếu AI nhận diện sai.
     * Luồng: JavaScript -> MeterModule -> Repository (Update local cache or Backend)
     */
    @ReactMethod
    fun updateManualMeterReading(readingId: String, serialNumber: String, readingValue: Double, promise: Promise) {
        if (!permissionManager.canAccessFullFeatures()) {
            promise.reject("ACCESS_DENIED", "Bạn không có quyền thực hiện chức năng này")
            return
        }
        scope.launch {
            try {
                val success = meterRepository.updateManualMeterReading(readingId, serialNumber, readingValue)
                promise.resolve(success)
            } catch (e: Exception) {
                promise.reject("UPDATE_MANUAL_ERROR", e.message, e)
            }
        }
    }
}
