package com.capstone.data.source.remote

import com.capstone.data.source.request.ResetPasswordRequest
import com.capstone.data.source.request.SendOtpRequest
import com.capstone.data.source.request.VerifyOtpRequest
import com.capstone.data.source.response.UserProfileResponse
import com.capstone.data.source.response.WrapperApiResponse
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST

interface AuthApi {
    @POST("/auth/login")
    suspend fun login(
        @Header("Authorization") bearer: String
    ): WrapperApiResponse<UserProfileResponse>

    @POST("/auth/send-otp")
    suspend fun sendOtp(
        @Body request: SendOtpRequest
    ): WrapperApiResponse<Unit?>

    @POST("/auth/verify-otp")
    suspend fun verifyOtp(
        @Body request: VerifyOtpRequest
    ): WrapperApiResponse<Unit?>

    @POST("/auth/reset-password")
    suspend fun resetPassword(
        @Body request: ResetPasswordRequest
    ): WrapperApiResponse<Unit?>

    @GET("/auth/me")
    suspend fun getMe(
        @Header("Authorization") bearer: String
    ): WrapperApiResponse<UserProfileResponse>
}
