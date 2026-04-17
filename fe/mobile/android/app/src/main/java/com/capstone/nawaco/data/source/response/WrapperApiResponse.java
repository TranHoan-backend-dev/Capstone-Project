package com.capstone.nawaco.data.source.response;

public class WrapperApiResponse<T> {
    private final int status;
    private final String message;
    private final T data;
    private final String timestamp;

    public WrapperApiResponse(int status, String message, T data, String timestamp) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.timestamp = timestamp;
    }

    public int getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }

    public T getData() {
        return data;
    }

    public String getTimestamp() {
        return timestamp;
    }
}
