package com.capstone.domain.model;

import androidx.annotation.Nullable;

public class Notification {
    private final String id;
    private final String link;
    private final String message;
    private final boolean isRead;
    private final String createdAt;

    public Notification(String id, @Nullable String link, String message, boolean isRead, String createdAt) {
        this.id = id;
        this.link = link;
        this.message = message;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }

    public String getId() {
        return id;
    }

    @Nullable
    public String getLink() {
        return link;
    }

    public String getMessage() {
        return message;
    }

    public boolean isRead() {
        return isRead;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public Notification copyWithRead(boolean isRead) {
        return new Notification(this.id, this.link, this.message, isRead, this.createdAt);
    }
}
