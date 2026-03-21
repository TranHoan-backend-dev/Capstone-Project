package com.capstone.ui.views;

import android.os.Bundle;
import androidx.activity.ComponentActivity;
import androidx.lifecycle.ViewModelProvider;
import com.capstone.ui.viewmodel.AuthViewModel;
import dagger.hilt.android.AndroidEntryPoint;

/**
 * Activity xử lý toàn bộ quy trình đăng nhập và xác thực của người dùng.
 * Tận dụng AuthViewModel được Hilt inject để truy xuất logic nghiệp vụ.
 */
@AndroidEntryPoint
public class LoginActivity extends ComponentActivity {

    private AuthViewModel viewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Khởi tạo ViewModel bằng ViewModelProvider (cú pháp Java cho Hilt/LifeCycle)
        viewModel = new ViewModelProvider(this).get(AuthViewModel.class);
        
        observeViewModel();
    }

    private void observeViewModel() {
        // Quan sát dữ liệu người dùng được trả về từ LiveData/State của ViewModel
        // Nếu đăng nhập thành công (UserProfile != null) -> Điều hướng tới MainActivity
        viewModel.getUserProfile().observe(this, userProfile -> {
            if (userProfile != null) {
                // TODO: Chuyển hướng màn hình (Intent to MainActivity)
            }
        });
    }

    /**
     * Phương thức được gọi từ View (Button Click) để thực hiện đăng nhập.
     */
    public void handleLogin(String token) {
        viewModel.login(token);
    }
}
