package com.capstone.notification.event.websocket;

import com.capstone.common.annotation.AppLog;
import com.capstone.notification.dto.request.CreateNotificationRequest;
import com.capstone.notification.service.boundary.NotificationService;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.List;

/**
 * Base class for all RabbitMQ event consumers.
 * <p>
 * Subclasses only need to implement {@link #buildMessage(Object)} to provide
 * the notification text. All infrastructure concerns (persistence, WebSocket
 * broadcast, logging) are handled here.
 *
 * @param <T> the event message type this consumer handles
 */
@AppLog
public abstract class GeneralEventConsumer<T> {

  @Autowired
  protected NotificationService notificationService;

  @Autowired
  protected SimpMessagingTemplate messagingTemplate;

  Logger log;

  /**
   * Entry point called by each subclass's {@code @RabbitListener} method.
   */
  protected void handle(T event, @NonNull List<String> topics, String title) {
    log.info("[{}] Received event: {}", getClass().getSimpleName(), event);

    var message = buildMessage(event);
    var request = new CreateNotificationRequest(title, message, null);
    var content = notificationService.createNotification(request);

    topics.forEach(topic -> {
      log.info("[{}] Broadcasting notification: {}", getClass().getSimpleName(), content);
      messagingTemplate.convertAndSend(topic, content);
    });
    // TODO: Bắn ngược sự kiện lại cho employee
  }

  /**
   * Builds the human-readable notification message from the incoming event.
   *
   * @param event the deserialized RabbitMQ message
   * @return the notification text to persist and broadcast
   */
  protected abstract String buildMessage(T event);
}
