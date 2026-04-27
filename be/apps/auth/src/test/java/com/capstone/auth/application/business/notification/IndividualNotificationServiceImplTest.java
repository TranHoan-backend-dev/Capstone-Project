package com.capstone.auth.application.business.notification;

import com.capstone.auth.application.dto.response.NotificationResponse;
import com.capstone.auth.domain.model.IndividualNotification;
import com.capstone.auth.infrastructure.persistence.IndividualNotificationRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;

import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class IndividualNotificationServiceImplTest {

  @Mock
  IndividualNotificationRepository repo;

  @InjectMocks
  IndividualNotificationServiceImpl service;

  @Test
  @DisplayName("should Return Notifications When Account Exists")
  void should_ReturnNotifications_When_AccountExists() {
    // Given
    var userId = "user-123";
    var pageable = PageRequest.of(0, 10);
    var notification = new IndividualNotification("noti-1", userId, false);

    when(repo.findAllByUserId(eq(userId), eq(pageable)))
      .thenReturn(List.of(notification));

    // When
    List<NotificationResponse> result = service.getNotificationIdsByAccount(userId, pageable);

    // Then
    assertThat(result).hasSize(1);
    assertThat(result.getFirst().notificationId()).isEqualTo("noti-1");
    assertThat(result.getFirst().isRead()).isFalse();
  }

  @Test
  @DisplayName("should Return Empty List When Response Is Null")
  void should_ReturnEmptyList_When_ResponseIsNull() {
    // Given
    var userId = "user-123";
    var pageable = PageRequest.of(0, 10);

    when(repo.findAllByUserId(eq(userId), eq(pageable)))
      .thenReturn(null);

    // When
    List<NotificationResponse> result = service.getNotificationIdsByAccount(userId, pageable);

    // Then
    assertThat(result).isEmpty();
  }

  @Test
  @DisplayName("should Return Empty List When Account Has No Notifications")
  void should_ReturnEmptyList_When_AccountHasNoNotifications() {
    // Given
    var userId = "user-123";
    var pageable = PageRequest.of(0, 10);

    when(repo.findAllByUserId(eq(userId), eq(pageable)))
      .thenReturn(Collections.emptyList());

    // When
    List<NotificationResponse> result = service.getNotificationIdsByAccount(userId, pageable);

    // Then
    assertThat(result).isEmpty();
  }
}
