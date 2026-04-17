package com.capstone.nawaco.common.utils;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import org.jetbrains.annotations.Contract;

/**
 * A simple wrapper class for representing success or failure results in Java,
 * mirroring Kotlin's Result type.
 */
public class Result<T> {
    private final T data;
    private final Throwable error;

    private Result(@Nullable T data, @Nullable Throwable error) {
        this.data = data;
        this.error = error;
    }

    @NonNull
    @Contract(value = "_ -> new", pure = true)
    public static <T> Result<T> success(T data) {
        return new Result<>(data, null);
    }

    @NonNull
    @Contract(value = "_ -> new", pure = true)
    public static <T> Result<T> failure(Throwable error) {
        return new Result<>(null, error);
    }

    public boolean isSuccess() {
        return error == null;
    }

    public boolean isFailure() {
        return error != null;
    }

    @Nullable
    public T getOrNull() {
        return data;
    }

    @Nullable
    public Throwable exceptionOrNull() {
        return error;
    }
}
