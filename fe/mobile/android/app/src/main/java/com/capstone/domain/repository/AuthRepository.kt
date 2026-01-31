package com.capstone.domain.repository

import com.capstone.domain.model.UserProfile

interface AuthRepository {
    suspend fun login(accessToken: String): UserProfile
}