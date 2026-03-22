package com.capstone.notification.event.producer;

import com.capstone.common.annotation.AppLog;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@AppLog
@Component
@RequiredArgsConstructor
public class MessageProducer {
  @Value("${rabbit-mq-config.exchange}")
  String EXCHANGE_NAME;

  Logger log;

  private final RabbitTemplate template;

  public void send(String routingKey, Object message) {
    log.info("Sending message to exchange: {}, routingKey: {}", EXCHANGE_NAME, routingKey);
    Map<String, Object> payload = new HashMap<>();
    payload.put("pattern", routingKey);
    payload.put("data", message);

    template.invoke(t -> {
      template.convertAndSend(EXCHANGE_NAME, routingKey, payload);
      return null;
    });
    log.info("Message sent successfully to RabbitMQ: {}", message);
  }
}
