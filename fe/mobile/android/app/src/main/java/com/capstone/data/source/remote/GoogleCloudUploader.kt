package com.capstone.data.source.remote

import com.capstone.common.utils.Constants
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.MultipartBody
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.asRequestBody
import java.io.File

class GoogleCloudUploader(
    private val httpClient: OkHttpClient,
    private val apiKey: String
) {
    private const val _prefix = "https://storage.googleapis.com"
    /**
     * Tải file lên Google Cloud Storage (GCS).
     * Luồng: File -> MultipartBody -> GCS API -> Trả về URL public.
     */
    suspend fun uploadImage(file: File): String {
        val requestBody = file.asRequestBody("image/jpeg".toMediaType())
        val multipartBody = MultipartBody.Builder()
            .setType(MultipartBody.FORM)
            .addFormDataPart("file", file.name, requestBody)
            .build()

        val request = Request.Builder()
            .url("$_prefix/upload/storage/v1/b/${Constants.GCS_BUCKET_NAME}/o?uploadType=multipart&name=${file.name}&key=$apiKey")
            .post(multipartBody)
            .build()

        return "$_prefix/${Constants.GCS_BUCKET_NAME}/${file.name}"
    }
}
