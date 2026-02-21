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
public class LateralConfig {
  final String entity = "${rabbit-mq-config.entities[0]}";
  final String updateKeyword = "${keyword.update}";
  final String deleteKeyword = "${keyword.delete}";
  final String exchange = "${keyword.exchange}";
  final String key = "${keyword.key}";
  final String queue = "${keyword.queue}";
  final String updatePrefix = updateKeyword + "_" + entity;
  final String deletePrefix = deleteKeyword + "_" + entity;

  // <editor-fold> desc="Update"
  @Value(updatePrefix + exchange)
  private String updateLateralExchange;
  @Value(updatePrefix + key)
  private String updateLateralRoutingKey;
  @Value(updatePrefix + queue)
  private String updateLateralQueue;

  @Bean
  public Queue updateLateralQueue() {
    return new Queue(updateLateralQueue, true);
  }

  @Bean
  public TopicExchange updateLateralExchange() {
    return new TopicExchange(updateLateralExchange);
  }

  @Bean
  public Binding updateLateralBinding() {
    return BindingBuilder.bind(updateLateralQueue()).to(updateLateralExchange()).with(updateLateralRoutingKey);
  }
  // </editor-fold>

  // <editor-fold> desc="Delete"
  @Value(deletePrefix + exchange)
  private String deleteLateralExchange;

  @Value(deletePrefix + key)
  private String deleteLateralRoutingKey;

  @Value(deletePrefix + queue)
  private String deleteLateralQueue;

  @Bean
  public Queue deleteLateralQueue() {
    return new Queue(deleteLateralQueue, true);
  }

  @Bean
  public TopicExchange deleteLateralExchange() {
    return new TopicExchange(deleteLateralExchange);
  }

  @Bean
  public Binding deleteLateralBinding() {
    return BindingBuilder.bind(deleteLateralQueue()).to(deleteLateralExchange()).with(deleteLateralRoutingKey);
  }
  // </editor-fold>
}
