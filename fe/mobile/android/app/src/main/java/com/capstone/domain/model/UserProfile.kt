package com.capstone.domain.model

import com.capstone.data.source.response.UserProfileResponse

data class UserProfile(
    val fullName: String,
    val avatarUrl: String?,
    val role: String,
    val username: String,
    val email: String
) {
    fun UserProfileResponse.toDomain() = UserProfile(
        fullName = fullName,
        avatarUrl = avatarUrl,
        role = role,
        username = username,
        email = email
    )
}