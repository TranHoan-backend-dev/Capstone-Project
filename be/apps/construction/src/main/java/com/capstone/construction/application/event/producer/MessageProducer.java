package com.capstone.construction.application.event.producer;

import com.capstone.common.annotation.AppLog;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@AppLog
@Service
@RequiredArgsConstructor
public class MessageProducer {
  Logger log;

  private final RabbitTemplate template;

  public void send(String type, String exchangeName, String routingKey, Object message) {
    log.info("Sending message to exchange: {}, routingKey: {}", exchangeName, routingKey);
    Map<String, Object> payload = new HashMap<>();
    payload.put("pattern", routingKey);
    payload.put("data", message);

    template.invoke(t -> {
      template.convertAndSend(exchangeName, routingKey, payload);
      return null;
    });
    log.info("Message sent successfully to RabbitMQ: {}", message);
  }
}
