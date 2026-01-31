package com.capstone.infrastructure.security

import okhttp3.Interceptor
import okhttp3.Response
import java.io.IOException
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Filter bảo mật cho tầng Network:
 * 1. Lọc và chuẩn hóa Header.
 * 2. Kiểm tra Rate Limit phía Client.
 * 3. Ngăn chặn các request không hợp lệ.
 */
@Singleton
class SecurityFilterInterceptor @Inject constructor(
    private val rateLimiter: RateLimiter
) : Interceptor {

    override fun intercept(chain: Interceptor.Chain): Response {
        val request = chain.request()
        val url = request.url.toString()

        // 1. Kiểm tra Rate Limit
        if (!rateLimiter.shouldAllowRequest(url)) {
            throw IOException("Rate limit exceeded. Please wait a moment.")
        }

        // 2. Lọc và bổ sung Security Headers
        val builder = request.newBuilder()
            .removeHeader("Server") // Ẩn thông tin server nếu có
            .addHeader("X-Content-Type-Options", "nosniff")
            .addHeader("X-Frame-Options", "DENY")
            .addHeader("X-XSS-Protection", "1; mode=block")
            .addHeader("User-Agent", "Capstone-Android-App/1.0") // Định danh app chính thống
            .addHeader("X-Requested-With", "XMLHttpRequest")

        // 3. Loại bỏ header "No-Authentication" sau khi Interceptor trước đó đã dùng xong
        builder.removeHeader("No-Authentication")

        return chain.proceed(builder.build())
    }
}
