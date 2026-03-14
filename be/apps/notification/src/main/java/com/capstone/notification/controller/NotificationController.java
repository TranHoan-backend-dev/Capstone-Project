package com.capstone.notification.controller;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.notification.dto.request.CreateNotificationRequest;
import com.capstone.notification.service.boundary.NotificationService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.slf4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@AppLog
@RestController
@Validated
@RequiredArgsConstructor
@RequestMapping("/")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationController {
  NotificationService notificationService;
  @NonFinal
  Logger log;

  @PostMapping("/notifications")
  public ResponseEntity<WrapperApiResponse> createNotification(
    @RequestBody @Valid CreateNotificationRequest request
  ) {
    log.info("Create notification request comes to endpoint: {}", request);
    var response = notificationService.createNotification(request);

    return Utils.returnCreatedResponse("Tạo thông báo thành công");
  }

  @GetMapping("/notifications")
  public ResponseEntity<WrapperApiResponse> getNotifications(
    @RequestParam @NotEmpty List<@NotBlank String> notificationIds,
    @RequestParam(defaultValue = "20") @Positive int size
  ) {
    if (notificationIds.size() != size) {
      return Utils.returnBadRequestResponse("Số lượng ID thông báo phải khớp với kích thước yêu cầu", null);
    }

    var response = notificationService.getNotificationsByIds(notificationIds, size);
    log.info("Get notifications successfully: {}", response);
    return Utils.returnOkResponse("Lấy danh sách thông báo thành công", response);
  }
}
