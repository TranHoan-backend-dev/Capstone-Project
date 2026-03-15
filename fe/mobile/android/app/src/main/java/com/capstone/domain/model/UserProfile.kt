package com.capstone.domain.model

import com.capstone.data.source.response.UserProfileResponse

data class UserProfile(
    val fullName: String,
    val avatarUrl: String?,
    val address: String?,
    val phoneNumber: String?,
    val gender: String?,
    val birthday: String?,
    val role: String,
    val username: String,
    val email: String
) {
    companion object {
        fun UserProfileResponse.toDomain() = UserProfile(
            fullName = fullName,
            avatarUrl = avatarUrl,
            address = address,
            phoneNumber = phoneNumber,
            gender = gender,
            birthday = birthday,
            role = role,
            username = username,
            email = email
        )
    }
}