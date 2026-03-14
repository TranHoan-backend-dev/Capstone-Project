package com.capstone.data.source.request

data class UpdateProfileRequest(
    val fullName: String? = null,
    val username: String? = null,
    val phoneNumber: String? = null,
    val birthdate: String? = null,
    val address: String? = null,
    val gender: Boolean? = null
)
