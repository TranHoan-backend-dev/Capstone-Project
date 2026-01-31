package com.capstone.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.capstone.domain.model.UserProfile
import com.capstone.domain.usecase.LoginUseCase
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow

class LoginViewModel(
    private val loginUseCase: LoginUseCase
): ViewModel() {
    private val _state = MutableStateFlow<LoginState>(LoginState.Idle)
    val state = _state.asStateFlow()

    fun login(accessToken: String) {
        viewModelScope.launch {
            _state.value = LoginState.Loading
            try {
                val profile = loginUseCase(accessToken)
                _state.value = LoginState.Success(profile)
            } catch(e: Exception) {
                _state.value = LoginState.Error(e.message ?: "Login failed")
            }
        }
    }
}

sealed class LoginState {
    object Idle: LoginState()
    object Loading: LoginState()
    data class Success(val profile: UserProfile): LoginState()
}