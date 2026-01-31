package com.capstone.infrastructure.security

import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.atomic.AtomicInteger
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Quản lý và ngăn chặn tấn công brute-force phía Client.
 * Giới hạn số lần thử sai cho các tính năng nhạy cảm như OTP hoặc Reset Password.
 */
@Singleton
class AntiBruteForceManager @Inject constructor() {

    private val maxAttempts = 5
    private val lockTimeMs = 15 * 60 * 1000L // Khóa 15 phút

    private val attemptCounts = ConcurrentHashMap<String, AttemptInfo>()

    /**
     * Kiểm tra xem một định danh (email/username) có đang bị khóa hay không.
     */
    fun isLocked(identifier: String): Boolean {
        val info = attemptCounts[identifier] ?: return false
        if (info.count.get() >= maxAttempts) {
            val elapsed = System.currentTimeMillis() - info.lastAttemptTime
            if (elapsed < lockTimeMs) {
                return true
            } else {
                // Hết thời gian khóa, tự động reset
                resetAttempts(identifier)
            }
        }
        return false
    }

    /**
     * Ghi nhận một lần thử thất bại.
     */
    fun recordFailure(identifier: String) {
        val info = attemptCounts.getOrPut(identifier) { AttemptInfo() }
        info.count.incrementAndGet()
        info.lastAttemptTime = System.currentTimeMillis()
    }

    /**
     * Reset số lần thử khi người dùng thực hiện thành công.
     */
    fun resetAttempts(identifier: String) {
        attemptCounts.remove(identifier)
    }

    /**
     * Lấy số lần thử còn lại.
     */
    fun getRemainingAttempts(identifier: String): Int {
        val info = attemptCounts[identifier] ?: return maxAttempts
        return (maxAttempts - info.count.get()).coerceAtLeast(0)
    }

    private class AttemptInfo {
        val count = AtomicInteger(0)
        var lastAttemptTime = System.currentTimeMillis()
    }
}
