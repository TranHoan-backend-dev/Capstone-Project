package com.capstone.domain.repository

import com.capstone.domain.model.UserProfile

interface AuthRepository {
    suspend fun login(accessToken: String): UserProfile
    suspend fun sendOtp(email: String): String
    suspend fun verifyOtp(email: String, otp: String): String
    suspend fun resetPassword(email: String, otp: String, newPassword: String): String
    suspend fun getMe(): UserProfile
}