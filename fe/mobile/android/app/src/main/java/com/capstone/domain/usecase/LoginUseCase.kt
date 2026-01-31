package com.capstone.domain.usecase

import com.capstone.domain.model.UserProfile
import com.capstone.domain.repository.AuthRepository

class LoginUseCase(
    private val repository: AuthRepository
) {
    suspend operator fun invoke(accessToken: String): UserProfile {
        require(accessToken.isNotBlank()) {"Access token is empty"}
        return repository.login(accessToken)
    }
}