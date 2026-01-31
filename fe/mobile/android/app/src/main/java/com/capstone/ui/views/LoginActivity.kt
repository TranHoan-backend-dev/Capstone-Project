package com.capstone.ui.views

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.viewModels
import com.capstone.ui.viewmodel.AuthViewModel
import dagger.hilt.android.AndroidEntryPoint

/**
 * Activity xử lý luồng đăng nhập của ứng dụng.
 * Sử dụng AuthViewModel để giao tiếp với tầng Domain/Data.
 */
@AndroidEntryPoint
class LoginActivity : ComponentActivity() {

    private val viewModel: AuthViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        observeViewModel()
    }

    private fun observeViewModel() {
        // Luồng: Theo dõi userProfile từ ViewModel. 
        // Nếu có profile thành công -> Chuyển sang màn hình chính.
    }

    private fun handleLogin(token: String) {
        viewModel.login(token)
    }
}
