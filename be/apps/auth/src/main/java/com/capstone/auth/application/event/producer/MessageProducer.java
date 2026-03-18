package com.capstone.auth.application.event.producer;

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
  @Value("${rabbit-mq-config.exchange_name}")
  private String EXCHANGE_NAME;

  Logger log;

  private final RabbitTemplate template;

  public void sendMessage(String routingKey, Object message) {
    // cấu hình để khớp định dạng nest.js
    Map<String, Object> payload = new HashMap<>();
    payload.put("pattern", routingKey);
    payload.put("data", message);

    // tai su dung context, tranh viec dong-mo context lien tuc moi khi co 1 request
    // duoc gui toi
    template.invoke(t -> {
      template.convertAndSend(EXCHANGE_NAME, routingKey, payload);
      return null;
    });
    // template.convertAndSend(EXCHANGE_NAME, ROUTING_KEY, payload);
    log.info("Message sent successfully: {}", message);
  }
}
