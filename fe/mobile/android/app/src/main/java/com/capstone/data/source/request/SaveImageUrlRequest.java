package com.capstone.data.source.request;

import androidx.annotation.Nullable;

import java.util.Map;

public class SaveImageUrlRequest {
    private final String imageUrl;
    private final Map<String, String> metadata;

    public SaveImageUrlRequest(String imageUrl, @Nullable Map<String, String> metadata) {
        this.imageUrl = imageUrl;
        this.metadata = metadata;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    @Nullable
    public Map<String, String> getMetadata() {
        return metadata;
    }
}
