package com.capstone.bridge

import com.capstone.domain.repository.MediaRepository
import com.facebook.react.bridge.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.io.File

class MediaBridgeModule(
    reactContext: ReactApplicationContext,
    private val mediaRepository: MediaRepository
) : ReactContextBaseJavaModule(reactContext) {

    private val scope = CoroutineScope(Dispatchers.IO)

    override fun getName(): String = "MediaModule"

    @ReactMethod
    fun uploadCapturedImage(filePath: String, promise: Promise) {
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

    @ReactMethod
    fun performOcr(imageUrl: String, promise: Promise) {
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
