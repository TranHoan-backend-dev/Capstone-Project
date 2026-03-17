package com.capstone.data.datasource

import com.capstone.data.source.remote.AuthApi
import com.capstone.data.source.request.ChangePasswordRequest
import com.capstone.data.source.request.UpdateProfileRequest
import com.capstone.data.source.request.ResetPasswordRequest
import com.capstone.data.source.request.SendOtpRequest
import com.capstone.data.source.request.VerifyOtpRequest
import com.capstone.data.source.response.UserProfileResponse
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.toRequestBody

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
     * Gọi API đổi mật khẩu.
     */
    suspend fun changePassword(request: ChangePasswordRequest): String {
        val response = api.changePassword(request)
        return response.message
    }

    /**
     * Cập nhật profile người dùng.
     */
    suspend fun updateProfile(request: UpdateProfileRequest): UserProfileResponse {
        val response = api.updateProfile(request)
        return response.data
    }

    /**
     * Cập nhật ảnh đại diện.
     */
    suspend fun updateAvatar(imageBytes: ByteArray): UserProfileResponse {
        val requestFile = imageBytes.toRequestBody("image/*".toMediaTypeOrNull(), 0, imageBytes.size)
        val body = MultipartBody.Part.createFormData("avatar", "avatar.jpg", requestFile)
        val response = api.updateAvatar(body)
        return response.data
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