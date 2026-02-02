package com.capstone.notification.service.impl;

import com.capstone.notification.dto.request.CreateNotificationRequest;
import com.capstone.notification.model.Notification;
import com.capstone.notification.repository.NotificationRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NotificationServiceImplTest {
  @Mock
  NotificationRepository notificationRepo;

  @InjectMocks
  NotificationServiceImpl notificationService;

  @Test
  void createNotification_savesAndReturnsResponse() {
    var request = new CreateNotificationRequest(
      "Payment received",
      "/payments/123"
    );

    when(notificationRepo.save(any(Notification.class))).thenAnswer(invocation -> {
      var saved = (Notification) invocation.getArgument(0);
      saved.setNotificationId("noti-1");
      return saved;
    });

    var response = notificationService.createNotification(request);

    var captor = ArgumentCaptor.forClass(Notification.class);
    verify(notificationRepo).save(captor.capture());

    var saved = captor.getValue();
    assertThat(saved.getMessage()).isEqualTo("Payment received");
    assertThat(saved.getLink()).isEqualTo("/payments/123");
    assertThat(saved.getStatus()).isFalse();
    assertThat(saved.getCreatedAt()).isNotNull();

    assertThat(response.notificationId()).isEqualTo("noti-1");
    assertThat(response.message()).isEqualTo("Payment received");
    assertThat(response.link()).isEqualTo("/payments/123");
    assertThat(response.status()).isFalse();
    assertThat(response.createdAt()).isNotNull();
  }

  @Test
  void getNotificationsByIds_returnsBatchResponse() {
    var notification = Notification.builder()
      .notificationId("noti-1")
      .message("Message 1")
      .link("/link-1")
      .status(false)
      .build();
    var ids = List.of("noti-1", "noti-2");

    when(notificationRepo.findAllById(ids))
      .thenReturn(List.of(notification));

    var response = notificationService.getNotificationsByIds(ids, 2);

    assertThat(response.items()).hasSize(1);
    assertThat(response.items().get(0).notificationId()).isEqualTo("noti-1");
    assertThat(response.requestedSize()).isEqualTo(2);
    assertThat(response.totalFound()).isEqualTo(1);
  }
}
