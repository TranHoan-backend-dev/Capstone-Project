package com.capstone.notification.config.rabbitmq;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CalculationUnitConfig {
  final String entity = "${rabbit-mq-config.entities[8]}";
  final String updateKeyword = "${keyword.update}";
  final String deleteKeyword = "${keyword.delete}";
  final String exchange = "${keyword.exchange}";
  final String key = "${keyword.key}";
  final String queue = "${keyword.queue}";
  final String updatePrefix = updateKeyword + "_" + entity;
  final String deletePrefix = deleteKeyword + "_" + entity;

  // <editor-fold> desc="Update"
  @Value(updatePrefix + exchange)
  String updateCommuneExchange;

  @Value(updatePrefix + key)
  String updateCommuneRoutingKey;

  @Value(updatePrefix + queue)
  String updateCommuneQueue;

  @Bean
  public Queue updateCommuneQueue() {
    return new Queue(updateCommuneQueue, true);
  }

  @Bean
  public TopicExchange updateCommuneExchange() {
    return new TopicExchange(updateCommuneExchange);
  }

  @Bean
  public Binding updateCommuneBinding() {
    return BindingBuilder.bind(updateCommuneQueue()).to(updateCommuneExchange()).with(updateCommuneRoutingKey);
  }
  // </editor-fold>

  // <editor-fold> desc="Delete"
  @Value(deletePrefix + exchange)
  String deleteCommuneExchange;

  @Value(deletePrefix + key)
  String deleteCommuneRoutingKey;

  @Value(deletePrefix + queue)
  String deleteCommuneQueue;

  @Bean
  public Queue deleteCommuneQueue() {
    return new Queue(deleteCommuneQueue, true);
  }

  @Bean
  public TopicExchange deleteCommuneExchange() {
    return new TopicExchange(deleteCommuneExchange);
  }

  @Bean
  public Binding deleteCommuneBinding() {
    return BindingBuilder.bind(deleteCommuneQueue()).to(deleteCommuneExchange()).with(deleteCommuneRoutingKey);
  }
  // </editor-fold>
}
