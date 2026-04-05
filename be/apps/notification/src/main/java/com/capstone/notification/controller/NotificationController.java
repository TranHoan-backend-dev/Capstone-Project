package com.capstone.notification.controller;

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
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@Validated
@RequiredArgsConstructor
@RequestMapping("/notification")
@Tag(name = "Notification API", description = "API quản lý thông báo cho nhân viên và phòng ban")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationController {
  NotificationService notificationService;
  SimpMessagingTemplate messagingTemplate;

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
  @PreAuthorize("hasAnyAuthority('IT_STAFF', 'PLANNING_TECHNICAL_DEPARTMENT_HEAD', 'SURVEY_STAFF', 'ORDER_RECEIVING_STAFF', " +
    "'FINANCE_DEPARTMENT', 'CONSTRUCTION_DEPARTMENT_HEAD', 'CONSTRUCTION_DEPARTMENT_STAFF', 'BUSINESS_DEPARTMENT_HEAD', " +
    "'METER_INSPECTION_STAFF', 'COMPANY_LEADERSHIP')")
  public ResponseEntity<WrapperApiResponse> getNotifications(
    @AuthenticationPrincipal Jwt jwt,
    Pageable pageable
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
  @Operation(summary = "Lấy số lượng thông báo chưa đọc", description = "Trả về tổng số lượng thông báo chưa đọc của nhân viên.")
  @GetMapping("/unread-count")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<WrapperApiResponse> getUnreadCount(
    @AuthenticationPrincipal Jwt jwt
  ) {
    var id = jwt.getSubject();
    var count = notificationService.getUnreadCount(id);
    return Utils.returnOkResponse("Lấy số lượng thông báo chưa đọc thành công", count);
  }

  @Operation(summary = "Đánh dấu thông báo là đã đọc")
  @PatchMapping("/{notificationId}/read")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<WrapperApiResponse> markAsRead(
    @AuthenticationPrincipal Jwt jwt,
    @PathVariable String notificationId
  ) {
    var id = jwt.getSubject();
    notificationService.markAsRead(id, notificationId);
    return Utils.returnOkResponse("Đánh dấu thông báo là đã đọc thành công", null);
  }

  @Operation(summary = "Xóa thông báo")
  @DeleteMapping("/{notificationId}")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<WrapperApiResponse> deleteNotification(
    @AuthenticationPrincipal Jwt jwt,
    @PathVariable String notificationId
  ) {
    var id = jwt.getSubject();
    notificationService.deleteNotification(id, notificationId);
    return Utils.returnOkResponse("Xóa thông báo thành công", null);
  }
}
