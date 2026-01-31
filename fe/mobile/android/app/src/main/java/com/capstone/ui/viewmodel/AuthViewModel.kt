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

/**
 * ViewModel quản lý toàn bộ trạng thái xác thực (Login, OTP, Profile).
 * Sử dụng AuthRepository để giao tiếp với tầng dữ liệu.
 */
@HiltViewModel
class AuthViewModel @Inject constructor(
    private val authRepository: AuthRepository
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
     */
    fun verifyOtp(email: String, otp: String) {
        viewModelScope.launch {
            _authState.value = AuthState.Loading
            try {
                val message = authRepository.verifyOtp(email, otp)
                _authState.value = AuthState.MessageSent(message)
            } catch (e: Exception) {
                _authState.value = AuthState.Error(e.message ?: "Verification failed")
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
