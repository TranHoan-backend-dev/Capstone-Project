package com.capstone.domain.repository;

import com.capstone.domain.model.Notification;
import java.util.List;

public interface NotificationRepository {
    List<Notification> getNotifications(int page, int size) throws Exception;
    boolean markAsRead(String notificationId) throws Exception;
}
