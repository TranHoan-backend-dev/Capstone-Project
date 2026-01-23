package com.capstone.auth.application.event.producer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class MessageProducer {
  @Value("${rabbitmqconfig.exchange_name}")
  public String EXCHANGE_NAME;

  @Value("${rabbitmqconfig.queue_name}")
  public String QUEUE_NAME;

  @Value("${rabbitmqconfig.routing_key}")
  public String ROUTING_KEY;

  private final RabbitTemplate template;

  public void sendMessage(Object message) {
    // cấu hình để khớp định dạng nest.js
    Map<String, Object> payload = new HashMap<>();
    payload.put("pattern", ROUTING_KEY);
    payload.put("data", message);

    // tai su dung context, tranh viec dong-mo context lien tuc moi khi co 1 request
    // duoc gui toi
    template.invoke(t -> {
      template.convertAndSend(EXCHANGE_NAME, ROUTING_KEY, payload);
      return null;
    });
    // template.convertAndSend(EXCHANGE_NAME, ROUTING_KEY, payload);
    log.info("Message sent successfully: {}", message);
  }
}
