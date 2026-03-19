package com.capstone.domain.model

data class PaymentInfo(
    val id: String,
    val amount: Double,
    val paymentDate: String,
    val isPaid: Boolean,
    val paymentMethod: String, // "Tiền mặt" or "Chuyển khoản"
    val description: String? = null
)
