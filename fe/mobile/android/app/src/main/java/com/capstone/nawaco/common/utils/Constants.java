package com.capstone.nawaco.common.utils;

/**
 * Lớp chứa các hằng số hệ thống (Environment strings, API Keys, URLs).
 */
public final class Constants {
    private Constants() {
    } // Ngăn việc khởi tạo instance

    /**
     * Base URL cho các API của hệ thống.
     * Sử dụng 10.0.2.2 cho Android Emulator.
     */
    public static final String BASE_URL = "https://api.nawaco.duckdns.org/";

    /**
     * Google Maps API Key placeholder.
     */
    public static final String GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY_HERE";

    /**
     * Google Cloud Storage Bucket Name.
     */
    public static final String GCS_BUCKET_NAME = "YOUR_BUCKET_NAME";
}
