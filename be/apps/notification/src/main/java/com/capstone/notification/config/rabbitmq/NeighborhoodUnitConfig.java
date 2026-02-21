package com.capstone.notification.config.rabbitmq;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class NeighborhoodUnitConfig {
  final String entity = "${rabbit-mq-config.entities[2]}";
  final String updateKeyword = "${keyword.update}";
  final String deleteKeyword = "${keyword.delete}";
  final String exchange = "${keyword.exchange}";
  final String key = "${keyword.key}";
  final String queue = "${keyword.queue}";
  final String updatePrefix = updateKeyword + "_" + entity;
  final String deletePrefix = deleteKeyword + "_" + entity;

  // <editor-fold> desc="Update"
  @Value(updatePrefix + exchange)
  private String updateUnitExchange;

  @Value(updatePrefix + key)
  private String updateUnitRoutingKey;

  @Value(updatePrefix + queue)
  private String updateUnitQueue;

  @Bean
  public Queue updateUnitQueue() {
    return new Queue(updateUnitQueue, true);
  }

  @Bean
  public TopicExchange updateUnitExchange() {
    return new TopicExchange(updateUnitExchange);
  }

  @Bean
  public Binding updateUnitBinding() {
    return BindingBuilder.bind(updateUnitQueue()).to(updateUnitExchange()).with(updateUnitRoutingKey);
  }
  // </editor-fold>

  // <editor-fold> desc="Delete"
  @Value(deletePrefix + exchange)
  private String deleteUnitExchange;

  @Value(deletePrefix + key)
  private String deleteUnitRoutingKey;

  @Value(deletePrefix + queue)
  private String deleteUnitQueue;

  @Bean
  public Queue deleteUnitQueue() {
    return new Queue(deleteUnitQueue, true);
  }

  @Bean
  public TopicExchange deleteUnitExchange() {
    return new TopicExchange(deleteUnitExchange);
  }

  @Bean
  public Binding deleteUnitBinding() {
    return BindingBuilder.bind(deleteUnitQueue()).to(deleteUnitExchange()).with(deleteUnitRoutingKey);
  }
  // </editor-fold>
}
