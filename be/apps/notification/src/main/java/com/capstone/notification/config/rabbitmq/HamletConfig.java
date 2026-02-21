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
public class HamletConfig {
  final String entity = "${rabbit-mq-config.entities[4]}";
  final String updateKeyword = "${keyword.update}";
  final String deleteKeyword = "${keyword.delete}";
  final String exchange = "${keyword.exchange}";
  final String key = "${keyword.key}";
  final String queue = "${keyword.queue}";
  final String updatePrefix = updateKeyword + "_" + entity;
  final String deletePrefix = deleteKeyword + "_" + entity;

  // <editor-fold> desc="Update"
  @Value(updatePrefix + exchange)
  String updateHamletExchange;

  @Value(updatePrefix + key)
  String updateHamletRoutingKey;

  @Value(updatePrefix + queue)
  String updateHamletQueue;

  @Bean
  public Queue updateHamletQueue() {
    return new Queue(updateHamletQueue, true);
  }

  @Bean
  public TopicExchange updateHamletExchange() {
    return new TopicExchange(updateHamletExchange);
  }

  @Bean
  public Binding updateHamletBinding() {
    return BindingBuilder.bind(updateHamletQueue()).to(updateHamletExchange()).with(updateHamletRoutingKey);
  }
  // </editor-fold>

  // <editor-fold> desc="Delete"
  @Value(deletePrefix + exchange)
  String deleteHamletExchange;

  @Value(deletePrefix + key)
  String deleteHamletRoutingKey;

  @Value(deletePrefix + queue)
  String deleteHamletQueue;

  @Bean
  public Queue deleteHamletQueue() {
    return new Queue(deleteHamletQueue, true);
  }

  @Bean
  public TopicExchange deleteHamletExchange() {
    return new TopicExchange(deleteHamletExchange);
  }

  @Bean
  public Binding deleteHamletBinding() {
    return BindingBuilder.bind(deleteHamletQueue()).to(deleteHamletExchange()).with(deleteHamletRoutingKey);
  }
  // </editor-fold>
}
