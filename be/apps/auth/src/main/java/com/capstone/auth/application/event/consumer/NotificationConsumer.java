package com.capstone.auth.application.event.consumer;

import com.capstone.auth.domain.model.IndividualNotification;
import com.capstone.auth.domain.model.Users;
import com.capstone.auth.infrastructure.persistence.IndividualNotificationRepository;
import com.capstone.auth.infrastructure.persistence.UserRepository;
import com.capstone.common.annotation.AppLog;
import com.capstone.common.enumerate.RoleName;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.*;

@AppLog
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationConsumer {
  UserRepository userRepository;
  IndividualNotificationRepository individualNotificationRepository;
  @NonFinal
  Logger log;

  @RabbitListener(queues = "auth.individual-notification.queue")
  public void handle(NotificationCreatedEvent message) {
    if (log == null) {
      log = org.slf4j.LoggerFactory.getLogger(NotificationConsumer.class);
    }

    log.info("Received notification create event: {}", message);
    if (message == null || message.data() == null) {
      log.warn("Invalid notification message: message or data is null. Message: {}", message);
      return;
    }

    var notificationId = message.data().notificationId();
    List<String> topics = message.data().topics();

    if (notificationId == null || topics == null) {
      log.warn("Invalid notification message: notificationId or topics is null in data: {}", message.data());
      return;
    }

    Set<RoleName> targetRoles = new HashSet<>();
    String userId = null;
    for (String topic : topics) {
      var components = topic.split("/");
      if (components.length == 4) {
        userId = components[3];
        topic = String.join("/", components[0], components[1], components[2]);
      }
      List<RoleName> roles = mapTopicToRoles(topic);
      if (roles != null) {
        targetRoles.addAll(roles);
      }

    }

    if (targetRoles.isEmpty()) {
      log.warn("No target roles found for topics: {}", topics);
      return;
    }

    saveNotification(targetRoles, userId, topics, notificationId);
  }

  private List<RoleName> mapTopicToRoles(@NonNull String topic) {
    return switch (topic) {
      // for department
      case "/notification" -> List.of(RoleName.values());
      case "/technical" -> List.of(
        RoleName.PLANNING_TECHNICAL_DEPARTMENT_HEAD,
        RoleName.SURVEY_STAFF,
        RoleName.ORDER_RECEIVING_STAFF);
      case "/construction" -> List.of(RoleName.CONSTRUCTION_DEPARTMENT_HEAD, RoleName.CONSTRUCTION_DEPARTMENT_STAFF);
      case "/business" -> List.of(RoleName.BUSINESS_DEPARTMENT_HEAD, RoleName.METER_INSPECTION_STAFF);
      case "/business/staff" -> List.of(RoleName.METER_INSPECTION_STAFF);
      case "/business/head" -> List.of(RoleName.BUSINESS_DEPARTMENT_HEAD);
      case "/it" -> List.of(RoleName.IT_STAFF);
      case "/finance" -> List.of(RoleName.FINANCE_DEPARTMENT);
      case "/leadership" -> List.of(RoleName.COMPANY_LEADERSHIP);

      // for individual of the planning-technical department
      case "/technical/head" -> List.of(RoleName.PLANNING_TECHNICAL_DEPARTMENT_HEAD);
      case "/technical/survey-staff" -> List.of(RoleName.SURVEY_STAFF);
      case "/technical/order-receiving-staff" -> List.of(RoleName.ORDER_RECEIVING_STAFF);
      default -> Collections.emptyList();
    };
  }

  private void saveNotification(Set<RoleName> targetRoles, String userId, List<String> topics, String notificationId) {
    List<IndividualNotification> individualNotifications;
    if (userId == null) {
      List<Users> targetUsers = userRepository.findByRoleNameIn(new ArrayList<>(targetRoles));
      if (targetUsers == null || targetUsers.isEmpty()) {
        log.info("No users found for roles corresponding to topics: {}", topics);
        return;
      }

      log.info("Found {} users for notification {}", targetUsers.size(), notificationId);

      individualNotifications = targetUsers.stream()
        .map(user -> new IndividualNotification(notificationId, user.getUserId(), false))
        .toList();
    } else {
      var user = userRepository.existsByUserId(userId);
      if (user == null || !user) {
        log.info("No user found for roles corresponding to topics: {}", topics);
        return;
      }
      individualNotifications = List.of(new IndividualNotification(notificationId, userId, false));
    }

    individualNotificationRepository.saveAll(individualNotifications);
    log.info("Saved {} individual notifications", individualNotifications.size());
  }
}
