package com.capstone.domain.usecase

import com.capstone.domain.model.UserProfile
import com.capstone.domain.repository.AuthRepository
import javax.inject.Inject

class GetProfileUseCase @Inject constructor(
    private val authRepository: AuthRepository
) {
    /**
     * Lấy thông tin profile của người dùng hiện tại.
     */
    suspend fun execute(): Result<UserProfile> {
        return try {
            val profile = authRepository.getMe()
            Result.success(profile)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
