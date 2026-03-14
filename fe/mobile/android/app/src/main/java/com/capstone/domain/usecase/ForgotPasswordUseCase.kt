package com.capstone.domain.usecase

import com.capstone.domain.repository.AuthRepository
import javax.inject.Inject

class ForgotPasswordUseCase @Inject constructor(
    private val authRepository: AuthRepository
) {
    /**
     * Gửi OTP đến email để khôi phục mật khẩu.
     */
    suspend fun sendOtp(email: String): Result<String> {
        return try {
            val message = authRepository.sendOtp(email)
            Result.success(message)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    /**
     * Xác thực OTP.
     */
    suspend fun verifyOtp(email: String, otp: String): Result<String> {
        return try {
            val message = authRepository.verifyOtp(email, otp)
            Result.success(message)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    /**
     * Đặt lại mật khẩu mới.
     */
    suspend fun resetPassword(email: String, otp: String, newPass: String): Result<String> {
        return try {
            val message = authRepository.resetPassword(email, otp, newPass)
            Result.success(message)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
