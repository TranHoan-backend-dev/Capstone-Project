package com.capstone.data.source.remote

import com.capstone.data.source.request.ResetPasswordRequest
import com.capstone.data.source.request.SendOtpRequest
import com.capstone.data.source.request.VerifyOtpRequest
import com.capstone.data.source.response.UserProfileResponse
import com.capstone.data.source.response.WrapperApiResponse
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.Headers
import retrofit2.http.POST

interface AuthApi {
    /** Đăng nhập hệ thống và lấy thông tin người dùng */
    @Headers("No-Authentication: true")
    @POST("/auth/login")
    suspend fun login(
        @Header("Authorization") bearer: String
    ): WrapperApiResponse<UserProfileResponse>

    /** Yêu cầu hệ thống gửi mã OTP qua Email */
    @Headers("No-Authentication: true")
    @POST("/auth/send-otp")
    suspend fun sendOtp(
        @Body request: SendOtpRequest
    ): WrapperApiResponse<Unit?>

    /** Gửi mã OTP để hệ thống xác thực */
    @Headers("No-Authentication: true")
    @POST("/auth/verify-otp")
    suspend fun verifyOtp(
        @Body request: VerifyOtpRequest
    ): WrapperApiResponse<Unit?>

    /** Thực hiện đặt lại mật khẩu mới */
    @Headers("No-Authentication: true")
    @POST("/auth/reset-password")
    suspend fun resetPassword(
        @Body request: ResetPasswordRequest
    ): WrapperApiResponse<Unit?>

    /** Lấy thông tin cá nhân của người dùng hiện tại */
    @GET("/auth/me")
    suspend fun getMe(): WrapperApiResponse<UserProfileResponse>
}
