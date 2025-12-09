package com.capstone.auth.infrastructure.config;

import lombok.experimental.FieldDefaults;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@FieldDefaults(makeFinal = true)
public class RabbitMQConfig {
  public static String EXCHANGE_NAME = "auth_event_exchange";
  public static String QUEUE_NAME = "user_registered_queue";
  public static String ROUTING_KEY = "user-created"; // chu ky gan vao tin nhan khi gui den Exchange

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
