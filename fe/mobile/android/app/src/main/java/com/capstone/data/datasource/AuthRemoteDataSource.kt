package com.capstone.data.datasource

import com.capstone.data.source.remote.AuthApi
import com.capstone.data.source.request.ResetPasswordRequest
import com.capstone.data.source.request.SendOtpRequest
import com.capstone.data.source.request.VerifyOtpRequest
import com.capstone.data.source.response.UserProfileResponse

class AuthRemoteDataSource(
    private val api: AuthApi
) {
    /**
     * Gọi API login của Backend kèm Bearer token.
     */
    suspend fun login(accessToken: String): UserProfileResponse {
        val response = api.login("Bearer $accessToken")
        return response.data
    }

    /**
     * Gọi API yêu cầu gửi OTP.
     */
    suspend fun sendOtp(email: String): String {
        val response = api.sendOtp(SendOtpRequest(email))
        return response.message
    }

    /**
     * Gọi API xác thực OTP.
     */
    suspend fun verifyOtp(email: String, otp: String): String {
        val response = api.verifyOtp(VerifyOtpRequest(email, otp))
        return response.message
    }

    /**
     * Gọi API đặt lại mật khẩu.
     */
    suspend fun resetPassword(request: ResetPasswordRequest): String {
        val response = api.resetPassword(request)
        return response.message
    }

    /**
     * Gọi API lấy thông tin profile người dùng.
     * Token được đính kèm tự động qua AuthInterceptor.
     */
    suspend fun getMe(): UserProfileResponse {
        val response = api.getMe()
        return response.data
    }
}