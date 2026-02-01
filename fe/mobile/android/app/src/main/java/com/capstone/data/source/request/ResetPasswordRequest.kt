package com.capstone.data.source.request

data class ResetPasswordRequest(
    val email: String,
    val otp: String,
    val newPassword: String
)
