package com.capstone.data.source.request

data class SaveImageUrlRequest(
    val imageUrl: String,
    val metadata: Map<String, String>? = null
)
