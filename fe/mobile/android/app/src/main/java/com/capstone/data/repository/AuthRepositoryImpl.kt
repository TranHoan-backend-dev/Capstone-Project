package com.capstone.data.repository

import com.capstone.data.datasource.AuthRemoteDataSource
import com.capstone.domain.model.UserProfile
import com.capstone.domain.repository.AuthRepository

class AuthRepositoryImpl(
    private val remote: AuthRemoteDataSource
): AuthRepository {
    /**
     * Xử lý logic đăng nhập: Gọi DataSource để lấy Profile sau đó convert sang Domain Model.
     */
    override suspend fun login(accessToken: String): UserProfile {
        // Based on the code in UserProfile.kt, we might need a workaround or if it's top-level
        // For now, I'll assume it works as used before or provide a local helper if needed.
        // Actually, let's just implement the new ones and use what's there for profile.
        return remote.login(accessToken).let { 
            UserProfile(it.fullName, it.avatarUrl, it.role, it.username, it.email)
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
     */
    override suspend fun verifyOtp(email: String, otp: String): String {
        return remote.verifyOtp(email, otp)
    }

    /**
     * Thực hiện đặt lại mật khẩu thông qua Remote DataSource.
     */
    override suspend fun resetPassword(email: String, otp: String, newPassword: String): String {
        return remote.resetPassword(com.capstone.data.source.request.ResetPasswordRequest(email, otp, newPassword))
    }

    /**
     * Lấy thông tin tài khoản hiện tại và convert sang Domain Model.
     */
    override suspend fun getMe(accessToken: String): UserProfile {
        return remote.getMe(accessToken).let {
            UserProfile(it.fullName, it.avatarUrl, it.role, it.username, it.email)
        }
    }
}