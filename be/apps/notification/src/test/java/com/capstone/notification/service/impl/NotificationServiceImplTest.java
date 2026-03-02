package com.capstone.notification.service.impl;

import com.capstone.notification.dto.request.CreateNotificationRequest;
import com.capstone.notification.model.Notification;
import com.capstone.notification.repository.NotificationRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NotificationServiceImplTest {
  @Mock
  NotificationRepository notificationRepo;

  @InjectMocks
  NotificationServiceImpl notificationService;

  @Test
  void createNotification_savesAndReturnsResponse() {
    // Given
    var request = new CreateNotificationRequest(
      "Payment title",
      "Payment message",
      "/payments/123");

    when(notificationRepo.save(any(Notification.class))).thenAnswer(invocation -> {
      Notification n = invocation.getArgument(0);
      ReflectionTestUtils.setField(n, "notificationId", "noti-1");
      return n;
    });

    // When
    var response = notificationService.createNotification(request);

    // Then
    assertThat(response.notificationId()).isEqualTo("noti-1");
    assertThat(response.title()).isEqualTo("Payment title");
    assertThat(response.message()).isEqualTo("Payment message");
    assertThat(response.link()).isEqualTo("/payments/123");
    assertThat(response.status()).isFalse();
    assertThat(response.createdAt()).isNotNull();
  }

  @Test
  void getNotificationsByIds_returnsBatchResponse() {
    // Given
    var notification = Notification.builder()
      .title("Title 1")
      .message("Message 1")
      .link("/link-1")
      .status(false)
      .build();
    ReflectionTestUtils.setField(notification, "notificationId", "noti-1");

    var ids = List.of("noti-1", "noti-2");

    when(notificationRepo.findAllById(ids))
      .thenReturn(List.of(notification));

    // When
    var response = notificationService.getNotificationsByIds(ids, 2);

    // Then
    assertThat(response.items()).hasSize(1);
    assertThat(response.items().getFirst().notificationId()).isEqualTo("noti-1");
    assertThat(response.requestedSize()).isEqualTo(2);
    assertThat(response.totalFound()).isEqualTo(1);
  }
}
