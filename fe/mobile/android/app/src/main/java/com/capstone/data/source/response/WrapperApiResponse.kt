package com.capstone.data.source.response

data class WrapperApiResponse<T>(
    val status: Int,
    val message: String,
    val data: T,
    val timestamp: String
)