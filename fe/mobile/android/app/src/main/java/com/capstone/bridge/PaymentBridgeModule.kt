package com.capstone.bridge

import com.capstone.domain.repository.PaymentRepository
import com.facebook.react.bridge.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import com.capstone.infrastructure.security.PermissionManager

class PaymentBridgeModule(
    reactContext: ReactApplicationContext,
    private val paymentRepository: PaymentRepository,
    private val permissionManager: PermissionManager
) : ReactContextBaseJavaModule(reactContext) {

    private val scope = CoroutineScope(Dispatchers.IO)

    override fun getName(): String = "PaymentModule"

    /**
     * Lấy danh sách thông tin thanh toán cho người dùng.
     * Luồng: JavaScript -> PaymentModule -> Repository -> API Backend -> Trả về mảng JSON
     */
    @ReactMethod
    fun getPayments(promise: Promise) {
        if (!permissionManager.canAccessFullFeatures()) {
            promise.reject("ACCESS_DENIED", "Bạn không có quyền thực hiện chức năng này")
            return
        }
        scope.launch {
            try {
                val payments = paymentRepository.getPayments()
                val list = Arguments.createArray()
                payments.forEach { payment ->
                    val map = Arguments.createMap().apply {
                        putString("id", payment.id)
                        putDouble("amount", payment.amount)
                        putString("paymentDate", payment.paymentDate)
                        putBoolean("isPaid", payment.isPaid)
                        putString("paymentMethod", payment.paymentMethod)
                        putString("description", payment.description ?: "")
                    }
                    list.pushMap(map)
                }
                promise.resolve(list)
            } catch (e: Exception) {
                promise.reject("GET_PAYMENTS_ERROR", e.message, e)
            }
        }
    }
}
