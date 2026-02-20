package com.capstone.notification.event.consumer;

import com.capstone.common.annotation.AppLog;
import com.capstone.notification.dto.request.CreateNotificationRequest;
import com.capstone.notification.service.boundary.NotificationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.slf4j.Logger;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@AppLog
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateLateralConsumer {
  Logger log;
  final NotificationService notificationService;
  final SimpMessagingTemplate messagingTemplate;

  @RabbitListener(queues = "${rabbit-mq-config.update-lateral.queue_name}")
  public void handleLateralUpdated(LateralEventMessage event) {
    log.info("Received LateralEventMessage: {}", event);

    var data = event.data();
    var message = String.format("""
      Phòng IT vừa cập nhật một nhánh tổng:
      Nhánh tổng cũ %s thuộc chi nhánh %s
      Nhánh tổng mới %s thuộc chi nhánh %s
      """, data.oldName(), data.newName(), data.oldNetwork(), data.newNetwork());

    var request = new CreateNotificationRequest(message, null);
    var content = notificationService.createBroadcastNotification(request);
    log.info("Sent message: {}", content);

    // gui cho tat ca cac user
    messagingTemplate.convertAndSend("/topic/notification", content);
  }
}
