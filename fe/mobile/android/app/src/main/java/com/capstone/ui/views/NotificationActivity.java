package com.capstone.ui.views;

import android.os.Bundle;
import androidx.activity.ComponentActivity;
import androidx.lifecycle.ViewModelProvider;
import com.capstone.ui.viewmodel.NotificationViewModel;
import dagger.hilt.android.AndroidEntryPoint;

/**
 * Activity hiển thị giao diện danh sách các thông báo của người dùng.
 * Sử dụng NotificationViewModel để quản lý dữ liệu thông báo và trạng thái tải.
 */
@AndroidEntryPoint
public class NotificationActivity extends ComponentActivity {

    private NotificationViewModel viewModel;
    private int currentPage = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Khởi tạo ViewModel thông qua Hilt/ViewModelProvider
        viewModel = new ViewModelProvider(this).get(NotificationViewModel.class);
        
        // Bắt đầu tải danh sách thông báo (trang đầu tiên)
        viewModel.fetchNotifications(currentPage, 20);
        
        observeViewModel();
    }

    private void observeViewModel() {
        // Quan sát danh sách thông báo cập nhật về từ ViewModel
        viewModel.getNotifications().observe(this, notifications -> {
            // TODO: Cập nhật dữ liệu vào RecyclerView Adapter
        });

        // Quan sát trạng thái đang tải (Loading) để hiển thị/ẩn ProgressBar
        viewModel.getIsLoading().observe(this, isLoading -> {
            // TODO: Hiển thịProgressBar nếu isLoading = true
        });
    }

    /**
     * Phương thức được gọi để tải thêm dữ liệu khi người dùng cuộn (Pagination).
     */
    public void loadMore() {
        currentPage++;
        viewModel.fetchNotifications(currentPage, 20);
    }
}
