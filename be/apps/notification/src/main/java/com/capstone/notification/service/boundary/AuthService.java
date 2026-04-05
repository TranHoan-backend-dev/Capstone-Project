package com.capstone.notification.service.boundary;

import com.capstone.common.config.feign.FeignAuthInterceptor;
import com.capstone.notification.dto.response.IndividualNotificationResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.cloud.openfeign.SpringQueryMap;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(
  name = "auth",
  path = "/api/v1/in",
  configuration = FeignAuthInterceptor.class
)
public interface AuthService {
  @GetMapping("/{userId}")
  List<IndividualNotificationResponse> getIndividualNotificationsOfAnEmployee(
    @SpringQueryMap Pageable pageable,
    @PathVariable String userId
  );

  @GetMapping("/{userId}/unread-count")
  long getUnreadCount(@PathVariable String userId);

  @PatchMapping("/{userId}/mark-read/{notificationId}")
  void markAsRead(@PathVariable String userId, @PathVariable String notificationId);

  @DeleteMapping("/{userId}/{notificationId}")
  void deleteNotification(@PathVariable String userId, @PathVariable String notificationId);
}
