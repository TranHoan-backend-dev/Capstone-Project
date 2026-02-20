package com.capstone.notification.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

  // <editor-fold> desc="Lateral"
  // Update
  @Value("${rabbit-mq-config.update-lateral.exchange_name}")
  private String updateLateralExchange;
  @Value("${rabbit-mq-config.update-lateral.routing_key}")
  private String updateLateralRoutingKey;
  @Value("${rabbit-mq-config.update-lateral.queue_name}")
  private String updateLateralQueue;

  // Delete
  @Value("${rabbit-mq-config.delete-lateral.exchange_name}")
  private String deleteLateralExchange;
  @Value("${rabbit-mq-config.delete-lateral.routing_key}")
  private String deleteLateralRoutingKey;
  @Value("${rabbit-mq-config.delete-lateral.queue_name}")
  private String deleteLateralQueue;

  // Queue
  @Bean
  public Queue updateLateralQueue() {
    return new Queue(updateLateralQueue, true);
  }

  @Bean
  public Queue deleteLateralQueue() {
    return new Queue(deleteLateralQueue, true);
  }

  // Exchange
  @Bean
  public TopicExchange updateLateralExchange() {
    return new TopicExchange(updateLateralExchange);
  }

  @Bean
  public TopicExchange deleteLateralExchange() {
    return new TopicExchange(deleteLateralExchange);
  }

  // Binding
  @Bean
  public Binding updateLateralBinding() {
    return BindingBuilder.bind(updateLateralQueue()).to(updateLateralExchange()).with(updateLateralRoutingKey);
  }

  @Bean
  public Binding deleteLateralBinding() {
    return BindingBuilder.bind(deleteLateralQueue()).to(deleteLateralExchange()).with(deleteLateralRoutingKey);
  }
  // </editor-fold>

  // <editor-fold> desc="Commune"
  // Update
  @Value("${rabbit-mq-config.update-commune.exchange_name}")
  private String updateCommuneExchange;
  @Value("${rabbit-mq-config.update-commune.routing_key}")
  private String updateCommuneRoutingKey;
  @Value("${rabbit-mq-config.update-commune.queue_name}")
  private String updateCommuneQueue;

  // Delete
  @Value("${rabbit-mq-config.delete-commune.exchange_name}")
  private String deleteCommuneExchange;
  @Value("${rabbit-mq-config.delete-commune.routing_key}")
  private String deleteCommuneRoutingKey;
  @Value("${rabbit-mq-config.delete-commune.queue_name}")
  private String deleteCommuneQueue;

  // Queue
  @Bean
  public Queue updateCommuneQueue() {
    return new Queue(updateCommuneQueue, true);
  }

  @Bean
  public Queue deleteCommuneQueue() {
    return new Queue(deleteCommuneQueue, true);
  }

  // Exchange
  @Bean
  public TopicExchange updateCommuneExchange() {
    return new TopicExchange(updateCommuneExchange);
  }

  @Bean
  public TopicExchange deleteCommuneExchange() {
    return new TopicExchange(deleteCommuneExchange);
  }

  // Binding
  @Bean
  public Binding updateCommuneBinding() {
    return BindingBuilder.bind(updateCommuneQueue()).to(updateCommuneExchange()).with(updateCommuneRoutingKey);
  }

  @Bean
  public Binding deleteCommuneBinding() {
    return BindingBuilder.bind(deleteCommuneQueue()).to(deleteCommuneExchange()).with(deleteCommuneRoutingKey);
  }
  // </editor-fold>

  // <editor-fold> desc="Unit"
  // Update
  @Value("${rabbit-mq-config.update-unit.exchange_name}")
  private String updateUnitExchange;
  @Value("${rabbit-mq-config.update-unit.routing_key}")
  private String updateUnitRoutingKey;
  @Value("${rabbit-mq-config.update-unit.queue_name}")
  private String updateUnitQueue;

  // Delete Unit
  @Value("${rabbit-mq-config.delete-unit.exchange_name}")
  private String deleteUnitExchange;
  @Value("${rabbit-mq-config.delete-unit.routing_key}")
  private String deleteUnitRoutingKey;
  @Value("${rabbit-mq-config.delete-unit.queue_name}")
  private String deleteUnitQueue;

  // Queue
  @Bean
  public Queue updateUnitQueue() {
    return new Queue(updateUnitQueue, true);
  }

  @Bean
  public Queue deleteUnitQueue() {
    return new Queue(deleteUnitQueue, true);
  }

  // Exchange
  @Bean
  public TopicExchange updateUnitExchange() {
    return new TopicExchange(updateUnitExchange);
  }

  @Bean
  public TopicExchange deleteUnitExchange() {
    return new TopicExchange(deleteUnitExchange);
  }

  // Binding
  @Bean
  public Binding updateUnitBinding() {
    return BindingBuilder.bind(updateUnitQueue()).to(updateUnitExchange()).with(updateUnitRoutingKey);
  }

  @Bean
  public Binding deleteUnitBinding() {
    return BindingBuilder.bind(deleteUnitQueue()).to(deleteUnitExchange()).with(deleteUnitRoutingKey);
  }
  // </editor-fold>

  // Infrastructure
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
}
