package com.capstone.notification.controller;

import com.capstone.notification.dto.request.CreateNotificationRequest;
import com.capstone.notification.dto.response.NotificationResponse;
import com.capstone.notification.dto.response.NotificationBatchResponse;
import com.capstone.notification.service.boundary.NotificationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(NotificationController.class)
@AutoConfigureMockMvc(addFilters = false)
class NotificationControllerTest {
  @Autowired
  MockMvc mockMvc;

  @Autowired
  ObjectMapper objectMapper;

  @MockBean
  NotificationService notificationService;

  @Test
  void createNotification_returnsCreatedResponse() throws Exception {
    var request = new CreateNotificationRequest(
      "Order shipped",
      "/orders/456"
    );
    var response = new NotificationResponse(
      "noti-123",
      "/orders/456",
      "Order shipped",
      false,
      LocalDateTime.parse("2026-01-01T10:00:00")
    );

    when(notificationService.createNotification(any(CreateNotificationRequest.class)))
      .thenReturn(response);

    mockMvc.perform(post("/notifications")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request)))
      .andExpect(status().isCreated())
      .andExpect(jsonPath("$.status").value(201))
      .andExpect(jsonPath("$.message").value("Create notification successfully"))
      .andExpect(jsonPath("$.data.notificationId").value("noti-123"))
      .andExpect(jsonPath("$.data.message").value("Order shipped"));
  }

  @Test
  void createNotification_invalidRequest_returnsBadRequest() throws Exception {
    var request = new CreateNotificationRequest(
      "",
      null
    );

    mockMvc.perform(post("/notifications")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request)))
      .andExpect(status().isBadRequest());
  }

  @Test
  void getNotifications_returnsPagedResponse() throws Exception {
    var response = new NotificationBatchResponse(
      List.of(new NotificationResponse(
        "noti-1",
        "/orders/1",
        "Order created",
        false,
        LocalDateTime.parse("2026-01-01T10:00:00")
      )),
      20,
      1
    );

    when(notificationService.getNotificationsByIds(List.of("noti-1"), 20))
      .thenReturn(response);

    mockMvc.perform(get("/notifications")
        .param("notificationIds", "noti-1")
        .param("size", "20"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.status").value(200))
      .andExpect(jsonPath("$.message").value("Get notifications successfully"))
      .andExpect(jsonPath("$.data.items[0].notificationId").value("noti-1"))
      .andExpect(jsonPath("$.data.requestedSize").value(20))
      .andExpect(jsonPath("$.data.totalFound").value(1));
  }

  @Test
  void getNotifications_sizeMismatch_returnsBadRequest() throws Exception {
    mockMvc.perform(get("/notifications")
        .param("notificationIds", "noti-1")
        .param("notificationIds", "noti-2")
        .param("size", "1"))
      .andExpect(status().isBadRequest())
      .andExpect(jsonPath("$.message")
        .value("Notification ids size must match requested size"));
  }

  @Test
  void getNotifications_missingIds_returnsBadRequest() throws Exception {
    mockMvc.perform(get("/notifications")
        .param("size", "20"))
      .andExpect(status().isBadRequest());
  }
}
