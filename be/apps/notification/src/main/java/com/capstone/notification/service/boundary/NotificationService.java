package com.capstone.notification.service.boundary;

import com.capstone.notification.dto.request.CreateNotificationRequest;
import com.capstone.notification.dto.response.NotificationBatchResponse;
import com.capstone.notification.dto.response.NotificationResponse;
import org.springframework.data.domain.Pageable;

public interface NotificationService {
  NotificationResponse createNotification(CreateNotificationRequest request);

  NotificationBatchResponse getNotificationsOfAnEmployee(Pageable pageable, String userId);
}
