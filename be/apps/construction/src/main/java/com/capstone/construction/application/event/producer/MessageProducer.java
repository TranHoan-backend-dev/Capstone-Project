package com.capstone.construction.application.event.producer;

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
    private String exchangeName;

    @Value("${rabbitmqconfig.routing_key}")
    private String routingKey;

    private final RabbitTemplate template;

    public void sendInstallationFormCreatedEvent(InstallationFormCreatedEvent message) {
        send(message);
    }

    private void send(Object message) {
        log.info("Sending message to exchange: {}, routingKey: {}", exchangeName, routingKey);
        Map<String, Object> payload = new HashMap<>();
        payload.put("pattern", routingKey);
        payload.put("data", message);

        try {
            template.invoke(t -> {
                template.convertAndSend(exchangeName, routingKey, payload);
                return null;
            });
            log.info("Message sent successfully to RabbitMQ: {}", message);
        } catch (Exception e) {
            log.error("Failed to send message to RabbitMQ: exchange={}, routingKey={}, error={}",
                    exchangeName, routingKey, e.getMessage());
            throw e;
        }
    }
}
