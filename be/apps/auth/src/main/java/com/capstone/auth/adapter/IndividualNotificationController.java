package com.capstone.auth.adapter;

import com.capstone.auth.application.business.notification.IndividualNotificationService;
import com.capstone.auth.application.dto.response.NotificationResponse;
import com.capstone.common.annotation.AppLog;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.slf4j.Logger;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AppLog
@RestController
@RequiredArgsConstructor
@RequestMapping("/in")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class IndividualNotificationController {
  IndividualNotificationService individualNotificationService;
  @NonFinal
  Logger log;

  @Operation(hidden = true)
  @GetMapping("/{id}")
  @PreAuthorize("hasAnyAuthority('IT_STAFF', 'SURVEY_STAFF', 'ORDER_RECEIVING_STAFF', " +
    "'PLANNING_TECHNICAL_DEPARTMENT_HEAD', 'COMPANY_LEADERSHIP', 'FINANCE_DEPARTMENT', " +
    "'CONSTRUCTION_DEPARTMENT_STAFF', 'CONSTRUCTION_DEPARTMENT_HEAD', 'BUSINESS_DEPARTMENT_HEAD'" +
    ", 'METER_INSPECTION_STAFF')")
  public List<NotificationResponse> getIndividualNotificationsOfAnEmployee(
    @PathVariable String id,
    Pageable pageable
  ) {
    log.info("getIndividualNotificationsOfAnEmployee");
    return individualNotificationService.getNotificationIdsByAccount(id, pageable);
  }

  @Operation(hidden = true)
  @GetMapping("/{id}/unread-count")
  @PreAuthorize("hasAnyAuthority('IT_STAFF', 'SURVEY_STAFF', 'ORDER_RECEIVING_STAFF', " +
    "'PLANNING_TECHNICAL_DEPARTMENT_HEAD', 'COMPANY_LEADERSHIP', 'FINANCE_DEPARTMENT', " +
    "'CONSTRUCTION_DEPARTMENT_STAFF', 'CONSTRUCTION_DEPARTMENT_HEAD', 'BUSINESS_DEPARTMENT_HEAD'" +
    ", 'METER_INSPECTION_STAFF')")
  public long getUnreadCount(@PathVariable String id) {
    return individualNotificationService.getUnreadCount(id);
  }

  @Operation(hidden = true)
  @PatchMapping("/{userId}/mark-read/{notificationId}")
  @PreAuthorize("hasAnyAuthority('IT_STAFF', 'SURVEY_STAFF', 'ORDER_RECEIVING_STAFF', " +
    "'PLANNING_TECHNICAL_DEPARTMENT_HEAD', 'COMPANY_LEADERSHIP', 'FINANCE_DEPARTMENT', " +
    "'CONSTRUCTION_DEPARTMENT_STAFF', 'CONSTRUCTION_DEPARTMENT_HEAD', 'BUSINESS_DEPARTMENT_HEAD'" +
    ", 'METER_INSPECTION_STAFF')")
  public void markAsRead(@PathVariable String userId, @PathVariable String notificationId) {
    individualNotificationService.markAsRead(userId, notificationId);
  }

  @Operation(hidden = true)
  @DeleteMapping("/{userId}/{notificationId}")
  @PreAuthorize("hasAnyAuthority('IT_STAFF', 'SURVEY_STAFF', 'ORDER_RECEIVING_STAFF', " +
    "'PLANNING_TECHNICAL_DEPARTMENT_HEAD', 'COMPANY_LEADERSHIP', 'FINANCE_DEPARTMENT', " +
    "'CONSTRUCTION_DEPARTMENT_STAFF', 'CONSTRUCTION_DEPARTMENT_HEAD', 'BUSINESS_DEPARTMENT_HEAD'" +
    ", 'METER_INSPECTION_STAFF')")
  public void deleteNotification(@PathVariable String userId, @PathVariable String notificationId) {
    individualNotificationService.deleteNotification(userId, notificationId);
  }
}
