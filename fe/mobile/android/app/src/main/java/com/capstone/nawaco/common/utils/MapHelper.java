package com.capstone.nawaco.common.utils;

import android.content.Context;
import android.location.Address;
import android.location.Geocoder;

import androidx.annotation.NonNull;

import org.jetbrains.annotations.Contract;

import java.util.List;
import java.util.Locale;

/**
 * Tiện ích hỗ trợ các nghiệp vụ liên quan đến Google Maps.
 */
public final class MapHelper {
    private MapHelper() {
    } // Lớp tiện ích không khởi tạo

    /**
     * Chuyển đổi từ tọa độ (Vĩ độ/Kinh độ) thành địa chỉ chữ (Reverse Geocoding).
     */
    @NonNull
    public static String getAddressFromLocation(Context context, double lat, double lng) {
        try {
            var geocoder = new Geocoder(context, Locale.getDefault());
            List<Address> addresses = geocoder.getFromLocation(lat, lng, 1);
            if (addresses != null && !addresses.isEmpty()) {
                var addressLine = addresses.get(0).getAddressLine(0);
                return (addressLine != null) ? addressLine : "Unknown Address";
            } else {
                return "Address not found";
            }
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    /**
     * Tạo đường dẫn URL Google Static Maps để hiển thị ảnh nhanh một vị trí.
     */
    @NonNull
    @Contract(pure = true)
    public static String getStaticMapUrl(double lat, double lng, int zoom) {
        return "https://maps.googleapis.com/maps/api/staticmap?center=" + lat + "," + lng +
                "&zoom=" + zoom + "&size=600x300&key=" + Constants.GOOGLE_MAPS_API_KEY;
    }

    /**
     * Overload với Zoom mặc định là 15.
     */
    @NonNull
    @Contract(pure = true)
    public static String getStaticMapUrl(double lat, double lng) {
        return getStaticMapUrl(lat, lng, 15);
    }
}
