package com.capstone.notification.config.rabbitmq;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ParameterConfig {
  final String entity = "${rabbit-mq-config.entities[9]}";
  final String updateKeyword = "${keyword.update}";
  final String deleteKeyword = "${keyword.delete}";
  final String exchange = "${keyword.exchange}";
  final String key = "${keyword.key}";
  final String queue = "${keyword.queue}";
  final String updatePrefix = updateKeyword + "_" + entity;
  final String deletePrefix = deleteKeyword + "_" + entity;

  // <editor-fold> desc="Update"
  @Value(updatePrefix + exchange)
  private String updateParameterExchange;

  @Value(updatePrefix + key)
  private String updateParameterRoutingKey;

  @Value(updatePrefix + queue)
  private String updateParameterQueue;

  @Bean
  public Queue updateParameterQueue() {
    return new Queue(updateParameterQueue, true);
  }

  @Bean
  public TopicExchange updateParameterExchange() {
    return new TopicExchange(updateParameterExchange);
  }

  @Bean
  public Binding updateParameterBinding() {
    return BindingBuilder.bind(updateParameterQueue()).to(updateParameterExchange())
      .with(updateParameterRoutingKey);
  }
  // </editor-fold>

  // <editor-fold> desc="Delete"
  @Value(deletePrefix + exchange)
  private String deleteParameterExchange;

  @Value(deletePrefix + key)
  private String deleteParameterRoutingKey;

  @Value(deletePrefix + queue)
  private String deleteParameterQueue;

  @Bean
  public Queue deleteParameterQueue() {
    return new Queue(deleteParameterQueue, true);
  }

  @Bean
  public TopicExchange deleteParameterExchange() {
    return new TopicExchange(deleteParameterExchange);
  }

  @Bean
  public Binding deleteParameterBinding() {
    return BindingBuilder.bind(deleteParameterQueue()).to(deleteParameterExchange())
      .with(deleteParameterRoutingKey);
  }
  // </editor-fold>
}
