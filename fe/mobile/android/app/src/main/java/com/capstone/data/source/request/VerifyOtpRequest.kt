package com.capstone.data.source.request

data class VerifyOtpRequest(
    val email: String,
    val otp: String
)
