package com.capstone.nawaco.infrastructure.security;

import androidx.annotation.NonNull;

import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;

import java.io.IOException;

import javax.inject.Inject;
import javax.inject.Singleton;

/**
 * Filter bảo mật cho tầng mạng:
 * 1. Chuẩn hóa và bổ sung các Security Header bảo vệ ứng dụng.
 * 2. Tích hợp Rate Limiting phía Client trước khi gửi request.
 * 3. Chống lại lỗi bảo vệ chéo trang và XSS cơ bản.
 */
@Singleton
public class SecurityFilterInterceptor implements Interceptor {

    private final RateLimiter rateLimiter;

    @Inject
    public SecurityFilterInterceptor(RateLimiter rateLimiter) {
        this.rateLimiter = rateLimiter;
    }

    @NonNull
    @Override
    public Response intercept(@NonNull Interceptor.Chain chain) throws IOException {
        var request = chain.request();
        var url = request.url().toString();

        // 1. Kiểm tra Rate Limit phía Client trước khi gọi Network
        if (!rateLimiter.shouldAllowRequest(url)) {
            throw new IOException("Rate limit exceeded. Please wait a moment.");
        }

        // 2. Lọc và bổ sung các header an toàn và bảo mật
        Request.Builder builder = request.newBuilder()
                .removeHeader("Server") // Ẩn thông tin Server định danh nếu có
                .addHeader("X-Content-Type-Options", "nosniff")
                .addHeader("X-Frame-Options", "DENY")
                .addHeader("X-XSS-Protection", "1; mode=block")
                .addHeader("User-Agent", "Capstone-Android-App/1.0") // Định danh app CAPSTONE-ANDROID
                .addHeader("X-Requested-With", "XMLHttpRequest");

        // 3. Xử lý dọn dẹp các header tạm thời dùng cho Bridge-Interop
        builder.removeHeader("No-Authentication");

        return chain.proceed(builder.build());
    }
}
