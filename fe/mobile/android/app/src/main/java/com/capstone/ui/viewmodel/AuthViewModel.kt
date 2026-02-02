package com.capstone.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.capstone.domain.model.UserProfile
import com.capstone.domain.repository.AuthRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject
import com.capstone.infrastructure.security.AntiBruteForceManager

/**
 * ViewModel quản lý toàn bộ trạng thái xác thực (Login, OTP, Profile).
 * Sử dụng AuthRepository để giao tiếp với tầng dữ liệu.
 */
@HiltViewModel
class AuthViewModel @Inject constructor(
    private val authRepository: AuthRepository,
    private val bruteForceManager: AntiBruteForceManager
) : ViewModel() {

    private val _authState = MutableStateFlow<AuthState>(AuthState.Idle)
    val authState = _authState.asStateFlow()

    /**
     * Thực hiện đăng nhập bằng token từ Keycloak.
     * Luồng: UI -> AuthViewModel.login -> AuthRepository -> Backend
     */
    fun login(accessToken: String) {
        viewModelScope.launch {
            _authState.value = AuthState.Loading
            try {
                val profile = authRepository.login(accessToken)
                _authState.value = AuthState.AuthSuccess(profile)
            } catch (e: Exception) {
                _authState.value = AuthState.Error(e.message ?: "Login failed")
            }
        }
    }

    /**
     * Gửi yêu cầu mã OTP về email.
     */
    fun sendOtp(email: String) {
        viewModelScope.launch {
            _authState.value = AuthState.Loading
            try {
                val message = authRepository.sendOtp(email)
                _authState.value = AuthState.MessageSent(message)
            } catch (e: Exception) {
                _authState.value = AuthState.Error(e.message ?: "Failed to send OTP")
            }
        }
    }

    /**
     * Xác thực mã OTP.
     * Bảo mật: Giới hạn số lần nhập sai.
     */
    fun verifyOtp(email: String, otp: String) {
        if (bruteForceManager.isLocked(email)) {
            _authState.value = AuthState.Error("Tài khoản bị tạm khóa do nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút.")
            return
        }

        viewModelScope.launch {
            _authState.value = AuthState.Loading
            try {
                val message = authRepository.verifyOtp(email, otp)
                bruteForceManager.resetAttempts(email)
                _authState.value = AuthState.MessageSent(message)
            } catch (e: Exception) {
                bruteForceManager.recordFailure(email)
                val remaining = bruteForceManager.getRemainingAttempts(email)
                _authState.value = AuthState.Error("Mã OTP không chính xác. Bạn còn $remaining lần thử.")
            }
        }
    }

    /**
     * Đặt lại mật khẩu mới.
     * Bảo mật: Giới hạn số lần thử sai.
     */
    fun resetPassword(email: String, otp: String, newPass: String) {
        if (bruteForceManager.isLocked(email)) {
            _authState.value = AuthState.Error("Tài khoản đang bị khóa.")
            return
        }

        viewModelScope.launch {
            _authState.value = AuthState.Loading
            try {
                val message = authRepository.resetPassword(email, otp, newPass)
                bruteForceManager.resetAttempts(email)
                _authState.value = AuthState.MessageSent(message)
            } catch (e: Exception) {
                bruteForceManager.recordFailure(email)
                _authState.value = AuthState.Error(e.message ?: "Đặt lại mật khẩu thất bại.")
            }
        }
    }

    /**
     * Lấy thông tin người dùng hiện tại (sử dụng session đã lưu).
     */
    fun fetchMe() {
        viewModelScope.launch {
            _authState.value = AuthState.Loading
            try {
                val profile = authRepository.getMe()
                _authState.value = AuthState.AuthSuccess(profile)
            } catch (e: Exception) {
                _authState.value = AuthState.Error(e.message ?: "Failed to fetch profile")
            }
        }
    }

    /**
     * Đặt lại trạng thái về Idle
     */
    fun resetState() {
        _authState.value = AuthState.Idle
    }
}

/**
 * Trạng thái của các tác vụ Auth
 */
sealed class AuthState {
    object Idle : AuthState()
    object Loading : AuthState()
    data class AuthSuccess(val profile: UserProfile) : AuthState()
    data class MessageSent(val message: String) : AuthState()
    data class Error(val message: String) : AuthState()
}
