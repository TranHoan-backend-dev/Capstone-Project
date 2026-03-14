package com.capstone.data.repository

import com.capstone.data.datasource.AuthRemoteDataSource
import com.capstone.domain.model.UserProfile
import com.capstone.domain.repository.AuthRepository
import com.capstone.infrastructure.security.TokenManager
import com.capstone.infrastructure.security.AntiBruteForceManager

class AuthRepositoryImpl(
    private val remote: AuthRemoteDataSource,
    private val tokenManager: TokenManager,
    private val bruteForceManager: AntiBruteForceManager
): AuthRepository {
    /**
     * Xử lý logic đăng nhập: Gọi DataSource để lấy Profile sau đó convert sang Domain Model.
     */
    override suspend fun login(accessToken: String): UserProfile {
        return remote.login(accessToken).let { profile ->
            tokenManager.saveSession(accessToken, "SIMULATED_REFRESH_TOKEN", profile.role)
            UserProfile(
                fullName = profile.fullName,
                avatarUrl = profile.avatarUrl,
                role = profile.role,
                username = profile.username,
                email = profile.email,
                departmentId = profile.departmentId,
                departmentName = profile.departmentName
            )
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
     * Thực hiện đổi mật khẩu khi đã đăng nhập.
     */
    override suspend fun changePassword(oldPass: String, newPass: String, confirmPass: String): String {
        return remote.changePassword(com.capstone.data.source.request.ChangePasswordRequest(oldPass, newPass, confirmPass))
    }

    override suspend fun updateProfile(
        fullName: String?,
        username: String?,
        phoneNumber: String?,
        birthdate: String?,
        address: String?,
        gender: Boolean?
    ): UserProfile {
        return remote.updateProfile(com.capstone.data.source.request.UpdateProfileRequest(fullName, username, phoneNumber, birthdate, address, gender))
            .let { profile ->
                with(UserProfile) { profile.toDomain() }
            }
    }

    override suspend fun updateAvatar(imageBytes: ByteArray): UserProfile {
        return remote.updateAvatar(imageBytes).let { profile ->
            with(UserProfile) { profile.toDomain() }
        }
    }

    /**
     * Lấy thông tin tài khoản hiện tại và convert sang Domain Model.
     * Token được đính kèm tự động qua tầng Interceptor.
     */
    override suspend fun getMe(): UserProfile {
        return remote.getMe().let { profile ->
            with(UserProfile) { profile.toDomain() }
        }
    }
}