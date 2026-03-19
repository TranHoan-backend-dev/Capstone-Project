package com.capstone.data.repository

import com.capstone.data.source.remote.PaymentApi
import com.capstone.domain.model.PaymentInfo
import com.capstone.domain.repository.PaymentRepository

class PaymentRepositoryImpl(
    private val api: PaymentApi
) : PaymentRepository {
    override suspend fun getPayments(): List<PaymentInfo> {
        val response = api.getPayments()
        return response.data
    }
}
