package com.capstone.notification.controller;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.notification.dto.request.CreateNotificationRequest;
import com.capstone.notification.service.boundary.NotificationService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.slf4j.Logger;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

@AppLog
@RestController
@Validated
@RequiredArgsConstructor
@RequestMapping("/notification")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationController {
  NotificationService notificationService;
  @NonFinal
  Logger log;

  @PostMapping
  public ResponseEntity<WrapperApiResponse> createNotification(
    @RequestBody @Valid CreateNotificationRequest request
  ) {
    log.info("Create notification request comes to endpoint: {}", request);
    var response = notificationService.createNotification(request);

    return Utils.returnCreatedResponse("Tạo thông báo thành công");
  }

  @GetMapping
  public ResponseEntity<WrapperApiResponse> getNotifications(
    @AuthenticationPrincipal Jwt jwt,
    @RequestParam Pageable pageable
  ) {
    var id = jwt.getSubject();
    var response = notificationService.getNotificationsOfAnEmployee(pageable, id);
    log.info("Get notifications successfully: {}", response);
    return Utils.returnOkResponse("Lấy danh sách thông báo thành công", response);
  }
}
