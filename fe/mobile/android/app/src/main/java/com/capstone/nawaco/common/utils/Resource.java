package com.capstone.nawaco.common.utils;

import androidx.annotation.Nullable;

/**
 * Lớp bọc (Wrapper) trạng thái dữ liệu cho UI.
 * Tương đương với sealed class Resource trong Kotlin.
 */
public abstract class Resource<T> {
    private final T data;
    private final String message;

    protected Resource(@Nullable T data, @Nullable String message) {
        this.data = data;
        this.message = message;
    }

    @Nullable
    public T getData() {
        return data;
    }

    @Nullable
    public String getMessage() {
        return message;
    }

    public static class Success<T> extends Resource<T> {
        public Success(T data) {
            super(data, null);
        }
    }

    public static class Error<T> extends Resource<T> {
        public Error(String message, @Nullable T data) {
            super(data, message);
        }
    }

    public static class Loading<T> extends Resource<T> {
        public Loading() {
            super(null, null);
        }
    }
}
