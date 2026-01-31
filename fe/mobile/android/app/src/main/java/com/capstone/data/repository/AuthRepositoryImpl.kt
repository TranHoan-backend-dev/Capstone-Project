package com.capstone.data.repository

import com.capstone.data.datasource.AuthRemoteDataSource
import com.capstone.domain.model.UserProfile
import com.capstone.domain.repository.AuthRepository

class AuthRepositoryImpl(
    private val remote: AuthRemoteDataSource,
    private val tokenManager: com.capstone.infrastructure.security.TokenManager,
    private val bruteForceManager: com.capstone.infrastructure.security.AntiBruteForceManager
): AuthRepository {
    /**
     * Xử lý logic đăng nhập: Gọi DataSource để lấy Profile sau đó convert sang Domain Model.
     */
    override suspend fun login(accessToken: String): UserProfile {
        return remote.login(accessToken).let { profile ->
            tokenManager.saveSession(accessToken, "SIMULATED_REFRESH_TOKEN", profile.role)
            UserProfile(profile.fullName, profile.avatarUrl, profile.role, profile.username, profile.email)
        }
    }

    /**
     * Gửi yêu cầu OTP thông qua Remote DataSource.
     */
    override suspend fun sendOtp(email: String): String {
        return remote.sendOtp(email)
    }

    /**
     * Xác thực mã OTP thông qua Remote DataSource.
     * Bảo mật: Thăng cường chống Brute Force.
     */
    override suspend fun verifyOtp(email: String, otp: String): String {
        if (bruteForceManager.isLocked(email)) {
            throw Exception("Tài khoản bị tạm khóa do thử sai quá nhiều lần. Vui lòng quay lại sau.")
        }
        return try {
            val result = remote.verifyOtp(email, otp)
            bruteForceManager.resetAttempts(email)
            result
        } catch (e: Exception) {
            bruteForceManager.recordFailure(email)
            throw e
        }
    }

    /**
     * Thực hiện đặt lại mật khẩu thông qua Remote DataSource.
     * Bảo mật: Thăng cường chống Brute Force.
     */
    override suspend fun resetPassword(email: String, otp: String, newPassword: String): String {
        if (bruteForceManager.isLocked(email)) {
            throw Exception("Tài khoản đang bị khóa.")
        }
        return try {
            val result = remote.resetPassword(com.capstone.data.source.request.ResetPasswordRequest(email, otp, newPassword))
            bruteForceManager.resetAttempts(email)
            result
        } catch (e: Exception) {
            bruteForceManager.recordFailure(email)
            throw e
        }
    }

    /**
     * Lấy thông tin tài khoản hiện tại và convert sang Domain Model.
     * Token được đính kèm tự động qua tầng Interceptor.
     */
    override suspend fun getMe(): UserProfile {
        return remote.getMe().let {
            UserProfile(it.fullName, it.avatarUrl, it.role, it.username, it.email)
        }
    }
}