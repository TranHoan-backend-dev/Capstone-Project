package com.capstone.auth.infrastructure.config;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@FieldDefaults(level = AccessLevel.PUBLIC)
public class RabbitMQConfig {
  @Value("${rabbitmqconfig.exchange_name}")
  String EXCHANGE_NAME;

  @Value("${rabbitmqconfig.queue_name}")
  String QUEUE_NAME;

  @Value("${rabbitmqconfig.routing_key}")
  String ROUTING_KEY; // chu ky gan vao tin nhan khi gui den Exchange

  // Luu tru tin nhan cho den khi co consumer su dung
  @Bean
  public Queue queue() {
    // duration false => tin nhan se mat neu khoi dong ung dung
    // duration true => tin nhan se ton tai vinh vien tren o dia cua rabbitmq
    return new Queue(QUEUE_NAME, false);
  }

  // dinh nghia diem gui tin nhan
  @Bean
  public TopicExchange exchange() {
    return new TopicExchange(EXCHANGE_NAME);
  }

  // Lien ket Queue va Exchange dua tren routing key
  @Bean
  public Binding binding(Queue queue, TopicExchange exchange) {
    return BindingBuilder.bind(queue)
      .to(exchange)
      .with(ROUTING_KEY);
  }

  @Bean
  public MessageConverter converter() {
    return new Jackson2JsonMessageConverter();
  }

  @Bean
  public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
    final var rabbitTemplate = new RabbitTemplate(connectionFactory);
    rabbitTemplate.setMessageConverter(converter());
    return rabbitTemplate;
  }
}
