package com.capstone.notification.config;

import com.capstone.common.config.RabbitTopologyProperties;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@EnableConfigurationProperties(RabbitTopologyProperties.class)
public class RabbitMQConfig {
  final RabbitTopologyProperties props;

  @Value("${rabbit-mq-config.queue}")
  String QUEUE;

  @Value("${rabbit-mq-config.exchange}")
  String EXCHANGE;

  @Value("${rabbit-mq-config.auth-queue}")
  String AUTH_QUEUE;

  @Value("${rabbit-mq-config.auth-routingKey}")
  String AUTH_ROUTING_KEY;

  @Bean
  public MessageConverter converter() {
    return new Jackson2JsonMessageConverter();
  }

  @Bean
  public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
    var rabbitTemplate = new RabbitTemplate(connectionFactory);
    rabbitTemplate.setChannelTransacted(true);
    rabbitTemplate.setMessageConverter(converter());
    return rabbitTemplate;
  }

  @Bean
  public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(ConnectionFactory connectionFactory) {
    var factory = new SimpleRabbitListenerContainerFactory();
    factory.setConnectionFactory(connectionFactory);
    factory.setMessageConverter(converter());
    return factory;
  }

  @Bean
  public Declarables rabbitDeclarables() {
    var exchange = new TopicExchange(EXCHANGE);

    List<Declarable> declarables = new ArrayList<>();
    declarables.add(exchange);

    for (var entity : props.getEntities()) {
      for (var action : props.getActions()) {
        Queue queue = new Queue(String.join(".", QUEUE, entity, action), true);
        declarables.add(queue);
        var routingKey = String.join(".", QUEUE, entity, action);

        declarables.add(
          BindingBuilder.bind(queue)
            .to(exchange)
            .with(routingKey));
      }
    }

    declarables.add(buildQueueForAuth(exchange));

    return new Declarables(declarables);
  }

  @Bean
  public RabbitAdmin rabbitAdmin(ConnectionFactory connectionFactory) {
    var admin = new RabbitAdmin(connectionFactory);
    admin.setAutoStartup(true);
    return admin;
  }

  private @NonNull Binding buildQueueForAuth(@NonNull TopicExchange exchange) {
    var queue = new Queue(AUTH_QUEUE, true);
    return BindingBuilder.bind(queue)
      .to(exchange)
      .with(AUTH_ROUTING_KEY);
  }
}
