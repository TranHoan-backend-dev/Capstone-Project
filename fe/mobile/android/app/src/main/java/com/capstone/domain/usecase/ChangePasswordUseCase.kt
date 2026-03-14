package com.capstone.domain.usecase

import com.capstone.domain.repository.AuthRepository
import javax.inject.Inject

class ChangePasswordUseCase @Inject constructor(
    private val authRepository: AuthRepository
) {
    /**
     * Thực hiện đổi mật khẩu khi đã đăng nhập.
     */
    suspend fun execute(oldPass: String, newPass: String, confirmPass: String): Result<String> {
        if (newPass != confirmPass) {
            return Result.failure(Exception("Mật khẩu mới và xác nhận mật khẩu không khớp."))
        }
        
        if (oldPass == newPass) {
            return Result.failure(Exception("Mật khẩu mới không được trùng với mật khẩu cũ."))
        }

        return try {
            val message = authRepository.changePassword(oldPass, newPass, confirmPass)
            Result.success(message)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
