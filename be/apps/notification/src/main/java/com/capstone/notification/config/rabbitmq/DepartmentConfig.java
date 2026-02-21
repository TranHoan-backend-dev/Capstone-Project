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
public class DepartmentConfig {
  final String entity = "${rabbit-mq-config.entities[11]}";
  final String updateKeyword = "${keyword.update}";
  final String deleteKeyword = "${keyword.delete}";
  final String exchange = "${keyword.exchange}";
  final String key = "${keyword.key}";
  final String queue = "${keyword.queue}";
  final String updatePrefix = updateKeyword + "_" + entity;
  final String deletePrefix = deleteKeyword + "_" + entity;

  // <editor-fold> desc="Update"
  @Value(updatePrefix + exchange)
  String updateDepartmentExchange;

  @Value(updatePrefix + key)
  String updateDepartmentRoutingKey;

  @Value(updatePrefix + queue)
  String updateDepartmentQueue;

  @Bean
  public Queue updateDepartmentQueue() {
    return new Queue(updateDepartmentQueue, true);
  }

  @Bean
  public TopicExchange updateDepartmentExchange() {
    return new TopicExchange(updateDepartmentExchange);
  }

  @Bean
  public Binding updateDepartmentBinding() {
    return BindingBuilder.bind(updateDepartmentQueue()).to(updateDepartmentExchange())
      .with(updateDepartmentRoutingKey);
  }
  // </editor-fold>

  // <editor-fold> desc="Delete"
  @Value(deletePrefix + exchange)
  String deleteDepartmentExchange;

  @Value(deletePrefix + key)
  String deleteDepartmentRoutingKey;

  @Value(deletePrefix + queue)
  String deleteDepartmentQueue;

  @Bean
  public Queue deleteDepartmentQueue() {
    return new Queue(deleteDepartmentQueue, true);
  }

  @Bean
  public TopicExchange deleteDepartmentExchange() {
    return new TopicExchange(deleteDepartmentExchange);
  }

  @Bean
  public Binding deleteDepartmentBinding() {
    return BindingBuilder.bind(deleteDepartmentQueue()).to(deleteDepartmentExchange())
      .with(deleteDepartmentRoutingKey);
  }
  // </editor-fold>
}
