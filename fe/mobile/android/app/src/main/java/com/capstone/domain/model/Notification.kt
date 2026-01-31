package com.capstone.domain.model

data class Notification(
    val id: String,
    val link: String?,
    val message: String,
    val isRead: Boolean,
    val createdAt: String
)
