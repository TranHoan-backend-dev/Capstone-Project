package com.capstone.notification.service.impl;

import com.capstone.common.annotation.AppLog;
import com.capstone.notification.dto.request.CreateNotificationRequest;
import com.capstone.notification.dto.response.NotificationBatchResponse;
import com.capstone.notification.dto.response.NotificationResponse;
import com.capstone.notification.model.Notification;
import com.capstone.notification.repository.NotificationRepository;
import com.capstone.notification.service.boundary.NotificationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@AppLog
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationServiceImpl implements NotificationService {
  NotificationRepository notificationRepo;
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
  public NotificationBatchResponse getNotificationsByIds(List<String> notificationIds, int size) {
    var result = notificationRepo.findAllById(notificationIds);
    var items = result.stream()
      .map(this::convert)
      .collect(Collectors.toList());

    return new NotificationBatchResponse(
      items,
      size,
      items.size()
    );
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
