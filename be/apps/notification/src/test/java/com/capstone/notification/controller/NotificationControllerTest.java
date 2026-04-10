package com.capstone.notification.controller;

import com.capstone.notification.dto.request.CreateDepartmentNotificationRequest;
import com.capstone.notification.dto.request.CreateNotificationRequest;
import com.capstone.notification.dto.response.NotificationResponse;
import com.capstone.notification.dto.response.NotificationBatchResponse;
import com.capstone.notification.event.consumer.Topic;
import com.capstone.notification.service.boundary.NotificationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
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

  @MockitoBean
  NotificationService notificationService;

  @MockitoBean
  org.springframework.messaging.simp.SimpMessagingTemplate messagingTemplate;

  @Test
  void createNotification_ShouldReturnCreated() throws Exception {
    var request = new CreateNotificationRequest("Title", "Message", "/link");
    var response = new NotificationResponse("id", "Title", "/link", "Message", false, LocalDateTime.now());

    when(notificationService.createNotification(any())).thenReturn(response);

    mockMvc.perform(post("/notification")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request)))
      .andExpect(status().isCreated())
      .andExpect(jsonPath("$.message").value("Tạo thông báo thành công"));
  }

  @Test
  void createNotification_ShouldReturnBadRequest_WhenInvalidInput() throws Exception {
    var request = new CreateNotificationRequest("", "", "/link");

    mockMvc.perform(post("/notification")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request)))
      .andExpect(status().isBadRequest());
  }

  @Test
  void getNotifications_ShouldReturnOk() throws Exception {
    var userId = "user-123";
    var response = new NotificationBatchResponse(List.of(), 10, 0);

    when(notificationService.getNotificationsOfAnEmployee(any(), eq(userId))).thenReturn(response);

    mockMvc.perform(get("/notification")
        .with(jwt().jwt(j -> j.subject(userId)))
        .param("page", "0")
        .param("size", "10"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.message").value("Lấy danh sách thông báo thành công"));
  }

  @Test
  void createDepartmentNotification_ShouldReturnCreated() throws Exception {
    var departmentRequest = new CreateDepartmentNotificationRequest(
      "Dept Title", "Dept Message", "/dept-link", List.of(Topic.IT)
    );
    var notificationResponse = new NotificationResponse("id", "Dept Title", "/dept-link", "Dept Message", false, LocalDateTime.now());

    when(notificationService.createNotification(any())).thenReturn(notificationResponse);

    mockMvc.perform(post("/notification/departments")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(departmentRequest)))
      .andExpect(status().isCreated())
      .andExpect(jsonPath("$.message").value("Tạo thông báo phòng ban thành công"));

    verify(messagingTemplate).convertAndSend(eq("/topic/IT"), any(NotificationResponse.class));
  }
}
