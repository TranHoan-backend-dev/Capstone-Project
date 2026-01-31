package com.capstone.bridge

import com.capstone.domain.repository.MediaRepository
import com.facebook.react.bridge.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.io.File

class MediaBridgeModule(
    reactContext: ReactApplicationContext,
    private val mediaRepository: MediaRepository,
    private val permissionManager: com.capstone.infrastructure.security.PermissionManager
) : ReactContextBaseJavaModule(reactContext) {

    private val scope = CoroutineScope(Dispatchers.IO)

    override fun getName(): String = "MediaModule"

    /**
     * Tải lên hình ảnh sau khi chụp.
     * Luồng: JavaScript (truyền filePath) -> MediaModule -> Repository -> Google Cloud Upload -> Save URL to Backend
     */
    @ReactMethod
    fun uploadCapturedImage(filePath: String, promise: Promise) {
        if (!permissionManager.canAccessFullFeatures()) {
            promise.reject("ACCESS_DENIED", "Bạn không có quyền thực hiện chức năng này")
            return
        }
        scope.launch {
            try {
                val file = File(filePath)
                if (!file.exists()) {
                    promise.reject("FILE_NOT_FOUND", "File at path $filePath does not exist")
                    return@launch
                }
                
                val resultUrl = mediaRepository.processCapturedImage(file)
                promise.resolve(resultUrl)
            } catch (e: Exception) {
                promise.reject("UPLOAD_ERROR", e.message, e)
            }
        }
    }

    /**
     * Thực hiện OCR nhận diện chữ trên ảnh (Hiện tại là placeholder).
     * Luồng: JavaScript (truyền imageUrl) -> MediaModule -> Repository -> OCR Service (Future)
     */
    @ReactMethod
    fun performOcr(imageUrl: String, promise: Promise) {
        if (!permissionManager.canAccessFullFeatures()) {
            promise.reject("ACCESS_DENIED", "Bạn không có quyền thực hiện chức năng này")
            return
        }
        scope.launch {
            try {
                val ocrResult = mediaRepository.performOcr(imageUrl)
                promise.resolve(ocrResult)
            } catch (e: Exception) {
                promise.reject("OCR_ERROR", e.message, e)
            }
        }
    }
}
