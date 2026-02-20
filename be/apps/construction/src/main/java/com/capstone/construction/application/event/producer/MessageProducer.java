package com.capstone.construction.application.event.producer;

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
  @Value("${rabbit-mq-config.update-lateral.exchange_name}")
  private String EXCHANGE_NAME;

  @Value("${rabbit-mq-config.update-lateral.routing_key}")
  private String ROUTING_KEY;

  Logger log;

  private final RabbitTemplate template;

  public void send(Object message) {
    log.info("Sending message to exchange: {}, routingKey: {}", EXCHANGE_NAME, ROUTING_KEY);
    Map<String, Object> payload = new HashMap<>();
    payload.put("pattern", ROUTING_KEY);
    payload.put("data", message);

    template.invoke(t -> {
      template.convertAndSend(EXCHANGE_NAME, ROUTING_KEY, payload);
      return null;
    });
    log.info("Message sent successfully to RabbitMQ: {}", message);
  }
}
