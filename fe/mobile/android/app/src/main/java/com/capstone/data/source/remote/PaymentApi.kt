package com.capstone.data.source.remote

import com.capstone.data.source.response.WrapperApiResponse
import com.capstone.domain.model.PaymentInfo
import retrofit2.http.GET

interface PaymentApi {
    /**
     * Lấy danh sách thông tin thanh toán cho người dùng.
     */
    @GET("/device/api/v1/water-meters/usage/payments")
    suspend fun getPayments(): WrapperApiResponse<List<PaymentInfo>>
}
