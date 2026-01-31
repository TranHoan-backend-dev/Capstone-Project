package com.capstone.notification.service.impl;

import com.capstone.notification.dto.request.CreateNotificationRequest;
import com.capstone.notification.dto.response.NotificationBatchResponse;
import com.capstone.notification.dto.response.NotificationResponse;
import com.capstone.notification.model.Notification;
import com.capstone.notification.repository.NotificationRepository;
import com.capstone.notification.service.boundary.NotificationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationServiceImpl implements NotificationService {
  NotificationRepository notificationRepo;

  @Override
  public NotificationResponse createNotification(CreateNotificationRequest request) {
    log.info("Creating notification with message: {}", request.message());

    var entity = Notification.builder()
      .message(request.message())
      .link(request.link())
      .status(false)
      .createdAt(LocalDateTime.now())
      .build();

    var saved = notificationRepo.save(entity);
    return new NotificationResponse(
      saved.getNotificationId(),
      saved.getLink(),
      saved.getMessage(),
      saved.getStatus(),
      saved.getCreatedAt()
    );
  }

  @Override
  public NotificationBatchResponse getNotificationsByIds(List<String> notificationIds, int size) {
    log.info("Fetching notifications by ids, requested size: {}", size);

    var result = notificationRepo.findAllById(notificationIds);
    var items = StreamSupport.stream(result.spliterator(), false)
      .map(notification -> new NotificationResponse(
        notification.getNotificationId(),
        notification.getLink(),
        notification.getMessage(),
        notification.getStatus(),
        notification.getCreatedAt()
      ))
      .collect(Collectors.toList());

    return new NotificationBatchResponse(
      items,
      size,
      items.size()
    );
  }
}
