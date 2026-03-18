package com.capstone.construction.infrastructure.service;

import com.capstone.common.config.feign.FeignAuthInterceptor;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.construction.application.dto.request.notification.CreateNotificationRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
  name = "notification",
  path = "/api/v1/notification",
  configuration = FeignAuthInterceptor.class
)
public interface NotificationService {
  @PostMapping
  WrapperApiResponse createNotification(@RequestBody CreateNotificationRequest request);
}
