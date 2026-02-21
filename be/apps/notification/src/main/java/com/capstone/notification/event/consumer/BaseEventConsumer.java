package com.capstone.notification.event.consumer;

import com.capstone.notification.dto.request.CreateNotificationRequest;
import com.capstone.notification.service.boundary.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;

/**
 * Base class for all RabbitMQ event consumers.
 * <p>
 * Subclasses only need to implement {@link #buildMessage(Object)} to provide
 * the notification text. All infrastructure concerns (persistence, WebSocket
 * broadcast, logging) are handled here.
 *
 * @param <T> the event message type this consumer handles
 */
public abstract class BaseEventConsumer<T> {

  private static final String NOTIFICATION_TOPIC = "/topic/notification";

  @Autowired
  protected NotificationService notificationService;

  @Autowired
  protected SimpMessagingTemplate messagingTemplate;

  private final Logger log = LoggerFactory.getLogger(getClass());

  /**
   * Entry point called by each subclass's {@code @RabbitListener} method.
   */
  protected void handle(T event) {
    log.info("[{}] Received event: {}", getClass().getSimpleName(), event);

    var message = buildMessage(event);
    var request = new CreateNotificationRequest(message, null);
    var content = notificationService.createNotification(request);

    log.info("[{}] Broadcasting notification: {}", getClass().getSimpleName(), content);
    messagingTemplate.convertAndSend(NOTIFICATION_TOPIC, content);
  }

  /**
   * Builds the human-readable notification message from the incoming event.
   *
   * @param event the deserialized RabbitMQ message
   * @return the notification text to persist and broadcast
   */
  protected abstract String buildMessage(T event);
}
