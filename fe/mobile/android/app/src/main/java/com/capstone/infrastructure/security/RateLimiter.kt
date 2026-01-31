package com.capstone.infrastructure.security

import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.atomic.AtomicInteger
import java.util.concurrent.atomic.AtomicLong
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Một trình giới hạn tốc độ (Rate Limiter) đơn giản triển khai thuật toán Token Bucket.
 * Giúp ngăn chặn ứng dụng gửi quá nhiều request trong một khoảng thời gian ngắn.
 */
@Singleton
class RateLimiter @Inject constructor() {
    
    private val limit = 10 // Tối đa 10 request
    private val windowMs = 1000L // Trong vòn 1 giây
    
    private val requestCounts = ConcurrentHashMap<String, RequestInfo>()

    /**
     * Kiểm tra xem một endpoint có đang bị vượt quá rate limit hay không.
     */
    fun shouldAllowRequest(endpoint: String): Boolean {
        val now = System.currentTimeMillis()
        val info = requestCounts.getOrPut(endpoint) { RequestInfo(AtomicInteger(0), AtomicLong(now)) }

        synchronized(info) {
            if (now - info.startTime.get() > windowMs) {
                // Đã qua cửa sổ thời gian, reset lại
                info.count.set(1)
                info.startTime.set(now)
                return true
            } else {
                return if (info.count.incrementAndGet() <= limit) {
                    true
                } else {
                    false
                }
            }
        }
    }

    private data class RequestInfo(
        val count: AtomicInteger,
        val startTime: AtomicLong
    )
}
