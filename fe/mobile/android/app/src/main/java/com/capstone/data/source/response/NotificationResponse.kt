package com.capstone.data.source.response

data class NotificationResponse(
    val notificationId: String,
    val link: String?,
    val message: String,
    val status: Boolean, // matches 'status' field in BE (Boolean status)
    val createdAt: String
)
