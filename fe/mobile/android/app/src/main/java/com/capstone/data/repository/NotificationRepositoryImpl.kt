package com.capstone.data.repository

import com.capstone.data.source.remote.NotificationApi
import com.capstone.domain.model.Notification
import com.capstone.domain.repository.NotificationRepository

class NotificationRepositoryImpl(
    private val api: NotificationApi
) : NotificationRepository {

    /**
     * Lấy danh sách thông báo phân trang và convert sang Domain Model.
     */
    override suspend fun getNotifications(page: Int, size: Int): List<Notification> {
        val response = api.getNotifications(page, size)
        return response.data.map {
            Notification(
                id = it.notificationId,
                link = it.link,
                message = it.message,
                isRead = it.status,
                createdAt = it.createdAt
            )
        }
    }

    /**
     * Đánh dấu đã đọc thông qua API.
     */
    override suspend fun markAsRead(notificationId: String): Boolean {
        val response = api.markAsRead(notificationId)
        return response.status == 200
    }
}
