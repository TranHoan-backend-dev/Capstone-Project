package com.capstone.nawaco.ui.views;

import android.os.Bundle;

import androidx.activity.ComponentActivity;

import dagger.hilt.android.AndroidEntryPoint;

/**
 * Activity hiển thị và tích hợp bản đồ Google Maps cho ứng dụng.
 * Tận dụng các API Key được định nghĩa trong Constants cho các dịch vụ Maps.
 */
@AndroidEntryPoint
public class MapActivity extends ComponentActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Thiết lập tiêu đề hiển thị cho Activity
        setTitle("Google Maps View");

        setupMap();
    }

    /**
     * Quy trình thiết lập MapView hoặc MapFragment của Google Maps.
     */
    private void setupMap() {
        // Luồng: Khởi tạo dữ liệu Bản đồ, Đăng ký Listener 
        // và di chuyển Camera đến các vị trí trạm đo hoặc tọa độ cần thiết.
    }
}
