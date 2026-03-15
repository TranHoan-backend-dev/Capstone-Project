package com.capstone.domain.repository

import com.capstone.domain.model.UserProfile

interface AuthRepository {
    suspend fun login(accessToken: String): UserProfile
    suspend fun sendOtp(email: String): String
    suspend fun verifyOtp(email: String, otp: String): String
    suspend fun resetPassword(email: String, otp: String, newPassword: String): String
    suspend fun changePassword(oldPass: String, newPass: String, confirmPass: String): String
    suspend fun updateProfile(fullName: String?, username: String?, phoneNumber: String?, birthdate: String?, address: String?, gender: Boolean?): UserProfile
    suspend fun updateAvatar(imageBytes: ByteArray): UserProfile
    suspend fun getMe(): UserProfile
}