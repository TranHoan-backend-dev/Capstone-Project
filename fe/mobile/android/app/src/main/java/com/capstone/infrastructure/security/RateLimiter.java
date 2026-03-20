package com.capstone.infrastructure.security;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;
import javax.inject.Inject;
import javax.inject.Singleton;

/**
 * Một trình giới hạn tốc độ (Rate Limiter) đơn giản triển khai thuật toán Token Bucket.
 * Giúp ngăn chặn ứng dụng gửi quá nhiều request trong một khoảng thời gian ngắn (chống Spam API).
 */
@Singleton
public class RateLimiter {
    
    private final int limit = 10; // Tối đa 10 request
    private final long windowMs = 1000L; // Trong vòng 1 giây (10 requests/s)
    
    private final ConcurrentHashMap<String, RequestInfo> requestCounts = new ConcurrentHashMap<>();

    @Inject
    public RateLimiter() {
    }

    /**
     * Kiểm tra xem một endpoint cụ thể có đang bị vượt quá tốc độ cho phép hay không.
     */
    public boolean shouldAllowRequest(String endpoint) {
        long now = System.currentTimeMillis();
        RequestInfo info = requestCounts.computeIfAbsent(endpoint, k -> new RequestInfo(new AtomicInteger(0), new AtomicLong(now)));

        synchronized (info) {
            if (now - info.startTime.get() > windowMs) {
                // Đã qua cửa sổ thời gian (1s), reset lại bộ đếm
                info.count.set(1);
                info.startTime.set(now);
                return true;
            } else {
                return info.count.incrementAndGet() <= limit;
            }
        }
    }

    private static class RequestInfo {
        final AtomicInteger count;
        final AtomicLong startTime;

        RequestInfo(AtomicInteger count, AtomicLong startTime) {
            this.count = count;
            this.startTime = startTime;
        }
    }
}
