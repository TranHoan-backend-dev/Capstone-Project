package com.capstone.notification.service.impl;

import com.capstone.common.annotation.AppLog;
import com.capstone.notification.dto.request.CreateNotificationRequest;
import com.capstone.notification.dto.response.NotificationBatchResponse;
import com.capstone.notification.dto.response.NotificationResponse;
import com.capstone.notification.model.Notification;
import com.capstone.notification.repository.NotificationRepository;
import com.capstone.notification.service.boundary.AuthService;
import com.capstone.notification.service.boundary.NotificationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@AppLog
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationServiceImpl implements NotificationService {
  NotificationRepository notificationRepo;
  AuthService service;
  @NonFinal
  Logger log;

  @Override
  public NotificationResponse createNotification(@NonNull CreateNotificationRequest request) {
    var entity = Notification.builder()
      .title(request.title())
      .message(request.message())
      .link(request.link())
      .status(false)
      .build();

    var saved = notificationRepo.save(entity);
    log.info("[{}] Saved notification: {}", getClass().getSimpleName(), saved);
    return convert(saved);
  }

  @Override
  public NotificationBatchResponse getNotificationsOfAnEmployee(Pageable pageable, String userId) {
    var individualNotifications = service.getIndividualNotificationsOfAnEmployee(pageable, userId);

    if (!individualNotifications.isEmpty()) {
      List<NotificationResponse> notificationResponses = new ArrayList<>();

      individualNotifications.forEach(notification -> {
        var n = notificationRepo.findById(notification.notificationId());
        n.ifPresent(value -> notificationResponses.add(new NotificationResponse(
          value.getNotificationId(),
          value.getTitle(),
          value.getLink(),
          value.getMessage(),
          notification.isRead(),
          value.getCreatedAt()
        )));
      });
      return new NotificationBatchResponse(
        notificationResponses,
        pageable.getPageSize(),
        individualNotifications.size()
      );
    }

    return null;
  }

  private @NonNull NotificationResponse convert(@NonNull Notification notification) {
    return new NotificationResponse(
      notification.getNotificationId(),
      notification.getTitle(),
      notification.getLink(),
      notification.getMessage(),
      notification.getStatus(),
      notification.getCreatedAt()
    );
  }
}
