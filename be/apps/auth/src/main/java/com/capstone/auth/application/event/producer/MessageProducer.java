package com.capstone.auth.application.event.producer;

import com.capstone.auth.infrastructure.config.RabbitMQConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class MessageProducer {
  private final RabbitTemplate template;

  public void sendMessage(AccountCreationEvent message) {
    // cấu hình để khớp định dạng nest.js
    Map<String, Object> payload = new HashMap<>();
    payload.put("pattern", RabbitMQConfig.ROUTING_KEY);
    payload.put("data", message);

    template.convertAndSend(
        RabbitMQConfig.EXCHANGE_NAME,
        RabbitMQConfig.ROUTING_KEY,
        payload);
    log.info("Message sent successfully: {}", message);
  }
}
