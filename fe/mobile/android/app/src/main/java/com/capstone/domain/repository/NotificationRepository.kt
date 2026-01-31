package com.capstone.domain.repository

import com.capstone.domain.model.Notification

interface NotificationRepository {
    /**
     * Get paginated notifications
     * @param page page number
     * @param size page size
     */
    suspend fun getNotifications(page: Int, size: Int): List<Notification>

    /**
     * Mark notification as read
     */
    suspend fun markAsRead(notificationId: String): Boolean
}
