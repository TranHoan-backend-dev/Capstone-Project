package com.capstone.ui.views

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.viewModels
import com.capstone.ui.viewmodel.NotificationViewModel
import dagger.hilt.android.AndroidEntryPoint

/**
 * Activity hiển thị danh sách thông báo của người dùng.
 * Hỗ trợ phân trang và cập nhật trạng thái đã đọc qua NotificationViewModel.
 */
@AndroidEntryPoint
class NotificationActivity : ComponentActivity() {

    private val viewModel: NotificationViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Tải trang đầu tiên
        viewModel.fetchNotifications(page = 0)
    }

    private fun loadMore() {
        // Luồng: Khi người dùng cuộn xuống dưới cùng -> Tăng số trang và tải tiếp
    }
}
