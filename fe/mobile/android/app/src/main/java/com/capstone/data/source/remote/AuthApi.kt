package com.capstone.data.source.remote

import com.capstone.data.source.response.UserProfileResponse
import com.capstone.data.source.response.WrapperApiResponse
import retrofit2.http.Header
import retrofit2.http.POST

interface AuthApi {
    @POST("/auth/auth/login")
    suspend fun login(
        @Header("Authorization") bearer: String
    ): WrapperApiResponse<UserProfileResponse>
}
