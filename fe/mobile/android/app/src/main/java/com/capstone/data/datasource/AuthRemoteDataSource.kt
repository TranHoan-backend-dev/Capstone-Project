package com.capstone.data.datasource

import com.capstone.data.source.remote.AuthApi
import com.capstone.data.source.request.ResetPasswordRequest
import com.capstone.data.source.request.SendOtpRequest
import com.capstone.data.source.request.VerifyOtpRequest
import com.capstone.data.source.response.UserProfileResponse

class AuthRemoteDataSource(
    private val api: AuthApi
) {
    suspend fun login(accessToken: String): UserProfileResponse {
        val response = api.login("Bearer $accessToken")
        return response.data
    }

    suspend fun sendOtp(email: String): String {
        val response = api.sendOtp(SendOtpRequest(email))
        return response.message
    }

    suspend fun verifyOtp(email: String, otp: String): String {
        val response = api.verifyOtp(VerifyOtpRequest(email, otp))
        return response.message
    }

    suspend fun resetPassword(request: ResetPasswordRequest): String {
        val response = api.resetPassword(request)
        return response.message
    }

    suspend fun getMe(accessToken: String): UserProfileResponse {
        val response = api.getMe("Bearer $accessToken")
        return response.data
    }
}