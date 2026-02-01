package com.capstone.notification.service.boundary;

import com.capstone.notification.dto.request.CreateNotificationRequest;
import com.capstone.notification.dto.response.NotificationBatchResponse;
import com.capstone.notification.dto.response.NotificationResponse;

public interface NotificationService {
  NotificationResponse createNotification(CreateNotificationRequest request);

  NotificationBatchResponse getNotificationsByIds(java.util.List<String> notificationIds, int size);
}
