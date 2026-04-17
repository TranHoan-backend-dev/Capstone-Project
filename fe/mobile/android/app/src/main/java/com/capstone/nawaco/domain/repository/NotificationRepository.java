package com.capstone.nawaco.domain.repository;

import com.capstone.nawaco.domain.model.Notification;

import java.util.List;

public interface NotificationRepository {
    List<Notification> getNotifications(int page, int size) throws Exception;

    boolean markAsRead(String notificationId) throws Exception;
}
