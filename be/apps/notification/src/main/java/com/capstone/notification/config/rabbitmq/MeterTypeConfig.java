package com.capstone.notification.config.rabbitmq;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MeterTypeConfig {
  final String entity = "${rabbit-mq-config.entities[6]}";
  final String updateKeyword = "${keyword.update}";
  final String deleteKeyword = "${keyword.delete}";
  final String exchange = "${keyword.exchange}";
  final String key = "${keyword.key}";
  final String queue = "${keyword.queue}";
  final String updatePrefix = updateKeyword + "_" + entity;
  final String deletePrefix = deleteKeyword + "_" + entity;

  // <editor-fold> desc="Update"
  @Value(updatePrefix + exchange)
  private String updateMeterTypeExchange;

  @Value(updatePrefix + key)
  private String updateMeterTypeRoutingKey;

  @Value(updatePrefix + queue)
  private String updateMeterTypeQueue;

  @Bean
  public Queue updateMeterTypeQueue() {
    return new Queue(updateMeterTypeQueue, true);
  }

  @Bean
  public TopicExchange updateMeterTypeExchange() {
    return new TopicExchange(updateMeterTypeExchange);
  }

  @Bean
  public Binding updateMeterTypeBinding() {
    return BindingBuilder.bind(updateMeterTypeQueue()).to(updateMeterTypeExchange())
      .with(updateMeterTypeRoutingKey);
  }
  // </editor-fold>

  // <editor-fold> desc="Delete"
  @Value(deletePrefix + exchange)
  private String deleteMeterTypeExchange;

  @Value(deletePrefix + key)
  private String deleteMeterTypeRoutingKey;

  @Value(deletePrefix + queue)
  private String deleteMeterTypeQueue;

  @Bean
  public Queue deleteMeterTypeQueue() {
    return new Queue(deleteMeterTypeQueue, true);
  }

  @Bean
  public TopicExchange deleteMeterTypeExchange() {
    return new TopicExchange(deleteMeterTypeExchange);
  }

  @Bean
  public Binding deleteMeterTypeBinding() {
    return BindingBuilder.bind(deleteMeterTypeQueue()).to(deleteMeterTypeExchange())
      .with(deleteMeterTypeRoutingKey);
  }
  // </editor-fold>
}
