package com.capstone.data.source.remote

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
    suspend fun uploadImage(file: File): String {
        val requestBody = file.asRequestBody("image/jpeg".toMediaType())
        val multipartBody = MultipartBody.Builder()
            .setType(MultipartBody.FORM)
            .addFormDataPart("file", file.name, requestBody)
            .build()

        val request = Request.Builder()
            .url("https://storage.googleapis.com/upload/storage/v1/b/YOUR_BUCKET_NAME/o?uploadType=multipart&name=${file.name}&key=$apiKey")
            .post(multipartBody)
            .build()

        return "https://storage.googleapis.com/YOUR_BUCKET_NAME/${file.name}"
    }
}
