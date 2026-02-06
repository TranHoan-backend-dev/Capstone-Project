package com.capstone.ui.views

import android.os.Bundle
import androidx.activity.ComponentActivity
import com.capstone.common.utils.Constants
import dagger.hilt.android.AndroidEntryPoint

/**
 * Activity hiển thị bản đồ Google Maps.
 * Tích hợp Map API Key từ Constants.
 */
@AndroidEntryPoint
class MapActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Lưu ý: Trong môi trường thực tế cần thêm cấu hình Gradle và XML
        // Ở đây thiết kế khung Activity tích hợp Maps
        title = "Google Maps View"
        
        setupMap()
    }

    private fun setupMap() {
        // Luồng: Khởi tạo MapView/MapFragment -> Gán API Key (thường qua Manifest)
        // -> Quay phim/di chuyển tới vị trí mong muốn
    }
}
