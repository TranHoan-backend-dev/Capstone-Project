package com.capstone.notification.service.impl;

import com.capstone.notification.dto.request.CreateNotificationRequest;
import com.capstone.notification.dto.response.IndividualNotificationResponse;
import com.capstone.notification.model.Notification;
import com.capstone.notification.repository.NotificationRepository;
import com.capstone.notification.service.boundary.AuthService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NotificationServiceImplTest {

  @Mock
  NotificationRepository notificationRepo;

  @Mock
  AuthService authService;

  @InjectMocks
  NotificationServiceImpl notificationService;

  @Test
  void should_CreateNotification_When_ValidRequest() {
    // Given
    var request = new CreateNotificationRequest(
      "Payment title",
      "Payment message",
      "/payments/123");

    when(notificationRepo.save(any(Notification.class))).thenAnswer(invocation -> {
      Notification n = invocation.getArgument(0);
      ReflectionTestUtils.setField(n, "notificationId", "noti-1");
      ReflectionTestUtils.setField(n, "createdAt", LocalDateTime.now());
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
  void should_GetNotifications_When_AccountHasNotifications() {
    // Given
    var userId = "user-123";
    var pageable = PageRequest.of(0, 10);

    // Auth service returns notification IDs and status
    IndividualNotificationResponse authNotification = new IndividualNotificationResponse(
      "noti-1",
      true // isRead
    );

    when(authService.getIndividualNotificationsOfAnEmployee(eq(pageable), eq(userId)))
      .thenReturn(List.of(authNotification));

    // Notification repo returns the content
    var notificationEnt = Notification.builder()
      .title("Title 1")
      .message("Message 1")
      .link("/link-1")
      .status(false)
      .build();
    ReflectionTestUtils.setField(notificationEnt, "notificationId", "noti-1");
    ReflectionTestUtils.setField(notificationEnt, "createdAt", LocalDateTime.now());

    when(notificationRepo.findById("noti-1"))
      .thenReturn(Optional.of(notificationEnt));

    // When
    var response = notificationService.getNotificationsOfAnEmployee(pageable, userId);

    // Then
    assertThat(response).isNotNull();
    assertThat(response.items()).hasSize(1);
    var item = response.items().getFirst();
    assertThat(item.notificationId()).isEqualTo("noti-1");
    assertThat(item.title()).isEqualTo("Title 1");
    assertThat(item.status()).isTrue(); // Taken from individual notification (isRead)
  }

  @Test
  void should_ReturnNull_When_AccountHasNoNotifications() {
    // Given
    var userId = "user-123";
    var pageable = PageRequest.of(0, 10);

    when(authService.getIndividualNotificationsOfAnEmployee(eq(pageable), eq(userId)))
      .thenReturn(Collections.emptyList());

    // When
    var response = notificationService.getNotificationsOfAnEmployee(pageable, userId);

    // Then
    assertThat(response).isNull();
  }

  @Test
  void should_HandleMissingRepositoryEntity_When_SomeNotificationsNotFound() {
    // Given
    var userId = "user-123";
    var pageable = PageRequest.of(0, 10);

    var authNotification = new IndividualNotificationResponse(
      "noti-1", true);

    when(authService.getIndividualNotificationsOfAnEmployee(any(), any()))
      .thenReturn(List.of(authNotification));

    when(notificationRepo.findById("noti-1"))
      .thenReturn(Optional.empty());

    // When
    var response = notificationService.getNotificationsOfAnEmployee(pageable, userId);

    // Then
    assertThat(response).isNotNull();
    assertThat(response.items()).isEmpty();
    assertThat(response.totalFound()).isEqualTo(1);
  }
}
