package com.capstone.organization.event.producer;

import com.capstone.common.annotation.AppLog;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@AppLog
@Service
@RequiredArgsConstructor
public class MessageProducer {
  @Value("${rabbit-mq-config.exchange}")
  String EXCHANGE_NAME;

  Logger log;

  private final RabbitTemplate template;

  public void send(String routingKey, Object data) {
    log.info("Sending data to exchange: {}, routingKey: {}", EXCHANGE_NAME, routingKey);
    Map<String, Object> payload = new HashMap<>();
    payload.put("pattern", routingKey);
    payload.put("data", data);

    template.invoke(t -> {
      template.convertAndSend(EXCHANGE_NAME, routingKey, payload);
      return null;
    });
    log.info("Message sent successfully to RabbitMQ: {}", data);
  }

  public void sendWithDelay(String routingKey, Object data) {
    log.info("Sending delay data to exchange: {}, routingKey: {}", EXCHANGE_NAME, routingKey);
    Map<String, Object> payload = new HashMap<>();
    payload.put("pattern", routingKey);
    payload.put("data", data);

    template.invoke(t -> {
      template.convertAndSend("delayed-exchange", routingKey, payload,
        message -> {
          message.getMessageProperties().setHeader("x-delay", 600000);
          return message;
        });
      return null;
    });
    log.info("Message sent successfully to RabbitMQ: {}", data);
  }
}
