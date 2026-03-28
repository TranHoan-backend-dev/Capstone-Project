package com.capstone.notification.controller;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.notification.dto.request.CreateDepartmentNotificationRequest;
import com.capstone.notification.dto.request.CreateNotificationRequest;
import com.capstone.notification.event.consumer.Topic;
import com.capstone.notification.service.boundary.NotificationService;
import com.capstone.notification.dto.response.NotificationBatchResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.slf4j.Logger;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@AppLog
@RestController
@Validated
@RequiredArgsConstructor
@RequestMapping("/notification")
@Tag(name = "Notification API", description = "API quản lý thông báo cho nhân viên và phòng ban")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationController {
  NotificationService notificationService;
  SimpMessagingTemplate messagingTemplate;
  @NonFinal
  Logger log;

  @Operation(summary = "Tạo thông báo cá nhân", description = "Dành cho IT STAFF để tạo một thông báo mới.", responses = {
    @ApiResponse(responseCode = "201", description = "Tạo thông báo thành công"),
    @ApiResponse(responseCode = "400", description = "Dữ liệu đầu vào không hợp lệ", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "403", description = "Không có quyền thực hiện hành động này", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PostMapping
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> createNotification(
    @RequestBody @Valid CreateNotificationRequest request
  ) {
    log.info("Create notification request comes to endpoint: {}", request);
    var response = notificationService.createNotification(request);
    log.info("Notification created: {}", response);
    return Utils.returnCreatedResponse("Tạo thông báo thành công");
  }

  @Operation(summary = "Lấy danh sách thông báo của nhân viên", description = "Nhân viên lấy danh sách các thông báo dành cho mình dựa trên JWT.", responses = {
    @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công", content = @Content(schema = @Schema(implementation = NotificationBatchResponse.class))),
    @ApiResponse(responseCode = "401", description = "Chưa xác thực", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
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

  @Operation(summary = "Tạo thông báo cho các phòng ban", description = "Dành cho IT STAFF để gửi thông báo tới các phòng ban cụ thể qua WebSocket.", responses = {
    @ApiResponse(responseCode = "201", description = "Tạo thông báo phòng ban thành công"),
    @ApiResponse(responseCode = "400", description = "Dữ liệu đầu vào không hợp lệ", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "403", description = "Không có quyền thực hiện hành động này", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PostMapping("/departments")
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> createDepartmentNotification(
    @RequestBody @Valid CreateDepartmentNotificationRequest request
  ) {
    log.info("Create department notification request: {}", request);

    var genericRequest = new CreateNotificationRequest(
      request.title(),
      request.message(),
      request.link());

    var notification = notificationService.createNotification(genericRequest);

    // gui toi tung phong ban muc tieu
    request.targetDepartmentCodes().forEach(department -> {
      var topic = Topic.getTopic(department);
      messagingTemplate.convertAndSend(topic, notification);
    });

    return Utils.returnCreatedResponse("Tạo thông báo phòng ban thành công");
  }
}
