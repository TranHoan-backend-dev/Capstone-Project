package com.capstone.data.source.remote

import com.capstone.data.source.request.SaveImageUrlRequest
import com.capstone.data.source.response.WrapperApiResponse
import retrofit2.http.Body
import retrofit2.http.POST

interface MediaApi {
    @POST("/api/v1/media/save-url")
    suspend fun saveImageUrl(
        @Body request: SaveImageUrlRequest
    ): WrapperApiResponse<Unit?>
}
