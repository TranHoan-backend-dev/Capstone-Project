package com.capstone.nawaco.data.source.response;

import androidx.annotation.Nullable;

public class NotificationResponse {
    private final String notificationId;
    private final String link;
    private final String message;
    private final boolean status;
    private final String createdAt;

    public NotificationResponse(String notificationId, @Nullable String link, String message, boolean status, String createdAt) {
        this.notificationId = notificationId;
        this.link = link;
        this.message = message;
        this.status = status;
        this.createdAt = createdAt;
    }

    public String getNotificationId() {
        return notificationId;
    }

    @Nullable
    public String getLink() {
        return link;
    }

    public String getMessage() {
        return message;
    }

    public boolean getStatus() {
        return status;
    }

    public String getCreatedAt() {
        return createdAt;
    }
}
