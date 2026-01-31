package com.capstone.data.repository

import com.capstone.data.datasource.AuthRemoteDataSource
import com.capstone.domain.model.UserProfile
import com.capstone.domain.repository.AuthRepository

class AuthRepositoryImpl(
    private val remote: AuthRemoteDataSource
): AuthRepository {
    override suspend fun login(accessToken: String): UserProfile {
        return remote.login(accessToken).toDomain()
    }
}