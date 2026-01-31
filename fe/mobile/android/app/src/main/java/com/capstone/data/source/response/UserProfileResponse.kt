package com.capstone.data.source.response

data class UserProfileResponse(
    val fullName: String,
    val avatarUrl: String?,
    val address: String?,
    val phoneNumber: String?,
    val gender: String?,
    val birthday: String?,
    val role: String,
    val username: String,
    val email: String
)