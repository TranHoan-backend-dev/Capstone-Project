package com.capstone.notification.event.websocket;

import com.capstone.common.annotation.AppLog;
import com.capstone.notification.dto.request.CreateNotificationRequest;
import com.capstone.notification.event.producer.MessageProducer;
import com.capstone.notification.event.producer.NotificationCreatedEvent;
import com.capstone.notification.service.boundary.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.List;
import java.util.Map;

/**
 * Base class for all RabbitMQ event consumers.
 * <p>
 * Subclasses only need to implement {@link #buildMessage(Object)} to provide
 * the notification text. All infrastructure concerns (persistence, WebSocket
 * broadcast, logging) are handled here.
 *
 * @param <T> the event message type this consumer handles
 */
@Slf4j
@RequiredArgsConstructor
public abstract class GeneralEventConsumer<T> {
  private final MessageProducer producer;

  @Value("${rabbit-mq-config.auth-routingKey}")
  String AUTH_ROUTING_KEY;

  @Autowired
  protected NotificationService notificationService;

  @Autowired
  protected SimpMessagingTemplate messagingTemplate;

  /**
   * Entry point called by each subclass's {@code @RabbitListener} method.
   */
  protected void handle(T event, @NonNull List<String> topics, String title, String link) {
    log.info("[{}] Received event: {}", getClass().getSimpleName(), event);

    var message = buildMessage(event);
    var request = new CreateNotificationRequest(title, message, link);
    var content = notificationService.createNotification(request);
    log.info("[{}] Sending notification: {}", getClass().getSimpleName(), content);

    topics.forEach(topic -> {
      messagingTemplate.convertAndSend(topic, content);
    });

    // Bắn ngược sự kiện lại cho auth service để người dùng lưu vào
    // IndividualNotification
    producer.send(AUTH_ROUTING_KEY, new NotificationCreatedEvent(content.notificationId(), topics));
  }

  /**
   * Builds the human-readable notification message from the incoming event.
   *
   * @param event the deserialized RabbitMQ message
   * @return the notification text to persist and broadcast
   */
  protected abstract String buildMessage(T event);
}
