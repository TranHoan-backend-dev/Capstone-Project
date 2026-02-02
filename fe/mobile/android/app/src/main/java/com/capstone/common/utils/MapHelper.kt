package com.capstone.common.utils

import android.content.Context
import android.location.Geocoder
import java.util.*

/**
 * Tiện ích hỗ trợ các tác vụ liên quan đến Google Maps.
 */
object MapHelper {

    /**
     * Chuyển đổi tọa độ (lat, lng) thành địa chỉ văn bản (Reverse Geocoding).
     */
    fun getAddressFromLocation(context: Context, lat: Double, lng: Double): String {
        return try {
            val geocoder = Geocoder(context, Locale.getDefault())
            val addresses = geocoder.getFromLocation(lat, lng, 1)
            if (addresses?.isNotEmpty() == true) {
                addresses[0].getAddressLine(0) ?: "Unknown Address"
            } else {
                "Address not found"
            }
        } catch (e: Exception) {
            "Error: ${e.message}"
        }
    }

    /**
     * Tạo URL static map để hiển thị ảnh bản đồ nhanh.
     */
    fun getStaticMapUrl(lat: Double, lng: Double, zoom: Int = 15): String {
        return "https://maps.googleapis.com/maps/api/staticmap?center=$lat,$lng&zoom=$zoom&size=600x300&key=${Constants.GOOGLE_MAPS_API_KEY}"
    }
}
