package com.capstone.auth.application.business.notification;

import com.capstone.auth.application.dto.response.NotificationResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IndividualNotificationService {
  List<NotificationResponse> getNotificationIdsByAccount(String id, Pageable pageable);
}
