package com.capstone.data.repository

import com.capstone.data.source.remote.GoogleCloudUploader
import com.capstone.data.source.remote.MediaApi
import com.capstone.data.source.request.SaveImageUrlRequest
import com.capstone.domain.repository.MediaRepository
import java.io.File

class MediaRepositoryImpl(
    private val mediaApi: MediaApi,
    private val gcsUploader: GoogleCloudUploader
) : MediaRepository {

    /**
     * Quy trình xử lý ảnh: Upload lên Google Cloud trước, sau đó lưu URL nhận được vào Backend.
     */
    override suspend fun processCapturedImage(file: File): String {
        val gcsUrl = gcsUploader.uploadImage(file)
        mediaApi.saveImageUrl(SaveImageUrlRequest(imageUrl = gcsUrl))
        return gcsUrl
    }

    /**
     * Placeholder cho chức năng OCR trong tương lai.
     */
    override suspend fun performOcr(imageUrl: String): String {
        return ""
    }
}
