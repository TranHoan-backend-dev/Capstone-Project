package com.capstone.infrastructure.security;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import javax.inject.Inject;
import javax.inject.Singleton;

@Singleton
public class AntiBruteForceManager {

    private final int maxAttempts = 5;
    private final long lockTimeMs = 15 * 60 * 1000L; // 15 minutes lock

    private final ConcurrentHashMap<String, AttemptInfo> attemptCounts = new ConcurrentHashMap<>();

    @Inject
    public AntiBruteForceManager() {
    }

    public boolean isLocked(String identifier) {
        AttemptInfo info = attemptCounts.get(identifier);
        if (info == null) return false;

        if (info.count.get() >= maxAttempts) {
            long elapsed = System.currentTimeMillis() - info.lastAttemptTime;
            if (elapsed < lockTimeMs) {
                return true;
            } else {
                resetAttempts(identifier);
            }
        }
        return false;
    }

    public void recordFailure(String identifier) {
        attemptCounts.compute(identifier, (key, val) -> {
            AttemptInfo info = (val != null) ? val : new AttemptInfo();
            info.count.incrementAndGet();
            info.lastAttemptTime = System.currentTimeMillis();
            return info;
        });
    }

    public void resetAttempts(String identifier) {
        attemptCounts.remove(identifier);
    }

    public int getRemainingAttempts(String identifier) {
        AttemptInfo info = attemptCounts.get(identifier);
        if (info == null) return maxAttempts;
        return Math.max(0, maxAttempts - info.count.get());
    }

    private static class AttemptInfo {
        final AtomicInteger count = new AtomicInteger(0);
        long lastAttemptTime = System.currentTimeMillis();
    }
}
