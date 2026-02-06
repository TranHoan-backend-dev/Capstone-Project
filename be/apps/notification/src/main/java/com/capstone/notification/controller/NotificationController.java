package com.capstone.notification.controller;

import com.capstone.notification.dto.request.CreateNotificationRequest;
import com.capstone.notification.dto.response.WrapperApiResponse;
import com.capstone.notification.service.boundary.NotificationService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RestController
@Validated
@RequiredArgsConstructor
@RequestMapping("/")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationController {
  NotificationService notificationService;

  @PostMapping("/notifications")
  public ResponseEntity<WrapperApiResponse> createNotification(
    @RequestBody @Valid CreateNotificationRequest request
  ) {
    log.info("Create notification request comes to endpoint: {}", request);
    var response = notificationService.createNotification(request);

    return ResponseEntity.ok(new WrapperApiResponse(
      HttpStatus.CREATED.value(),
      "Create notification successfully",
      response,
      LocalDateTime.now()
    ));
  }

  @GetMapping("/notifications")
  public ResponseEntity<WrapperApiResponse> getNotifications(
    @RequestParam @NotEmpty List<@NotBlank String> notificationIds,
    @RequestParam(defaultValue = "20") @Positive int size
  ) {
    if (notificationIds.size() != size) {
      return ResponseEntity.badRequest().body(new WrapperApiResponse(
        HttpStatus.BAD_REQUEST.value(),
        "Notification ids size must match requested size",
        null,
        LocalDateTime.now()
      ));
    }

    var response = notificationService.getNotificationsByIds(notificationIds, size);
    return ResponseEntity.ok(new WrapperApiResponse(
      HttpStatus.OK.value(),
      "Get notifications successfully",
      response,
      LocalDateTime.now()
    ));
  }
}
