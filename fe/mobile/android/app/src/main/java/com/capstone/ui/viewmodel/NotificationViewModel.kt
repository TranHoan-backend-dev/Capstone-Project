package com.capstone.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.capstone.domain.model.Notification
import com.capstone.domain.repository.NotificationRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class NotificationViewModel @Inject constructor(
    private val notificationRepository: NotificationRepository
) : ViewModel() {

    private val _notifications = MutableStateFlow<List<Notification>>(emptyList())
    val notifications: StateFlow<List<Notification>> = _notifications

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    /**
     * Lấy danh sách thông báo có phân trang
     */
    fun fetchNotifications(page: Int, size: Int = 20) {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                val newNotifications = notificationRepository.getNotifications(page, size)
                _notifications.value = if (page == 0) newNotifications else _notifications.value + newNotifications
                _error.value = null
            } catch (e: Exception) {
                _error.value = e.message
            } finally {
                _isLoading.value = false
            }
        }
    }

    /**
     * Đánh dấu đã đọc
     */
    fun markAsRead(id: String) {
        viewModelScope.launch {
            try {
                val success = notificationRepository.markAsRead(id)
                if (success) {
                    // Update local state
                    _notifications.value = _notifications.value.map {
                        if (it.id == id) it.copy(isRead = true) else it
                    }
                }
            } catch (e: Exception) {
                _error.value = e.message
            }
        }
    }
}
