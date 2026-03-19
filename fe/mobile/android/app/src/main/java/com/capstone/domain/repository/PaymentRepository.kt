package com.capstone.domain.repository

import com.capstone.domain.model.PaymentInfo

interface PaymentRepository {
    /**
     * Lấy danh sách thông tin thanh toán cho người dùng hiện tại.
     * Thông tin gồm đã chuyển khoản hay tiền mặt, trạng thái đã thanh toán chưa.
     */
    suspend fun getPayments(): List<PaymentInfo>
}
