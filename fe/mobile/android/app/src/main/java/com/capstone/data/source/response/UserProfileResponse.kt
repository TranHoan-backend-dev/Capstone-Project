package com.capstone.data.source.response

import com.google.gson.annotations.SerializedName

data class UserProfileResponse(
    @SerializedName("fullname")
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