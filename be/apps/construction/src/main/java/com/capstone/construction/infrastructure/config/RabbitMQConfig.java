package com.capstone.construction.infrastructure.config;

import com.capstone.common.config.RabbitTopologyProperties;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.amqp.core.*;
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

  @Value("${rabbit-mq-config.exchange}")
  String EXCHANGE_NAME;

  @Value("${rabbit-mq-config.queue_name}")
  String QUEUE_NAME;

  @Bean
  public Declarables rabbitDeclarables() {
    TopicExchange exchange = new TopicExchange(EXCHANGE_NAME);

    List<Declarable> declarables = new ArrayList<>();
    declarables.add(exchange);

    for (String entity : props.getEntities()) {
      for (String action : props.getActions()) {
        Queue queue = new Queue(String.join(".", QUEUE_NAME, entity, action), true);
        declarables.add(queue);
        String routingKey = String.join(".", QUEUE_NAME, entity, action);

        declarables.add(
          BindingBuilder.bind(queue)
            .to(exchange)
            .with(routingKey));
      }
    }

    return new Declarables(declarables);
  }

  @Bean
  public MessageConverter converter() {
    return new Jackson2JsonMessageConverter();
  }

  @Bean
  public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
    final var rabbitTemplate = new RabbitTemplate(connectionFactory);
    rabbitTemplate.setChannelTransacted(true);
    rabbitTemplate.setMessageConverter(converter());
    return rabbitTemplate;
  }

  @Bean
  public RabbitAdmin rabbitAdmin(ConnectionFactory connectionFactory) {
    return new RabbitAdmin(connectionFactory);
  }

  // Luu tru tin nhan cho den khi co consumer su dung
  // @Bean
  // public Queue queue() {
  // // duration false => tin nhan se mat neu khoi dong ung dung
  // // duration true => tin nhan se ton tai vinh vien tren o dia cua rabbitmq
  // return new Queue(QUEUE_NAME, false);
  // }
  //
  // // dinh nghia diem gui tin nhan
  // @Bean
  // public TopicExchange exchange() {
  // return new TopicExchange(EXCHANGE_NAME);
  // }

  // Lien ket Queue va Exchange dua tren routing key
  // @Bean
  // public Binding binding(Queue queue, TopicExchange exchange) {
  // return BindingBuilder.bind(queue)
  // .to(exchange)
  // .with(ROUTING_KEY);
  // }
}
