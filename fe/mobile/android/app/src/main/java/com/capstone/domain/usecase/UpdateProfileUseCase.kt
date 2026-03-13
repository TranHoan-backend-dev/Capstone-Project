package com.capstone.domain.usecase

import com.capstone.domain.model.UserProfile
import com.capstone.domain.repository.AuthRepository
import javax.inject.Inject

class UpdateProfileUseCase @Inject constructor(
    private val authRepository: AuthRepository
) {
    /**
     * Cập nhật thông tin profile của người dùng.
     */
    suspend fun updateInfo(
        fullName: String? = null,
        username: String? = null,
        phoneNumber: String? = null,
        birthdate: String? = null,
        address: String? = null,
        gender: Boolean? = null
    ): Result<UserProfile> {
        return try {
            val profile = authRepository.updateProfile(fullName, username, phoneNumber, birthdate, address, gender)
            Result.success(profile)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    /**
     * Cập nhật ảnh đại diện.
     */
    suspend fun updateAvatar(imageBytes: ByteArray): Result<UserProfile> {
        return try {
            val profile = authRepository.updateAvatar(imageBytes)
            Result.success(profile)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
