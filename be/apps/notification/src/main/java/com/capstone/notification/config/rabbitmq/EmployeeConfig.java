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
public class EmployeeConfig {
  final String entity = "${rabbit-mq-config.entities[12]}";
  final String updateKeyword = "${keyword.update}";
  final String deleteKeyword = "${keyword.delete}";
  final String exchange = "${keyword.exchange}";
  final String key = "${keyword.key}";
  final String queue = "${keyword.queue}";
  final String updatePrefix = updateKeyword + "_" + entity;
  final String deletePrefix = deleteKeyword + "_" + entity;

  // <editor-fold> desc="Update"
  @Value(updatePrefix + exchange)
  String updateEmployeeExchange;

  @Value(updatePrefix + key)
  String updateEmployeeRoutingKey;

  @Value(updatePrefix + queue)
  String updateEmployeeQueue;

  @Bean
  public Queue updateEmployeeQueue() {
    return new Queue(updateEmployeeQueue, true);
  }

  @Bean
  public TopicExchange updateEmployeeExchange() {
    return new TopicExchange(updateEmployeeExchange);
  }

  @Bean
  public Binding updateEmployeeBinding() {
    return BindingBuilder.bind(updateEmployeeQueue()).to(updateEmployeeExchange()).with(updateEmployeeRoutingKey);
  }
  // </editor-fold>

  // <editor-fold> desc="Delete"
  @Value(deletePrefix + exchange)
  String deleteEmployeeExchange;

  @Value(deletePrefix + key)
  String deleteEmployeeRoutingKey;

  @Value(deletePrefix + queue)
  String deleteEmployeeQueue;

  @Bean
  public Queue deleteEmployeeQueue() {
    return new Queue(deleteEmployeeQueue, true);
  }

  @Bean
  public TopicExchange deleteEmployeeExchange() {
    return new TopicExchange(deleteEmployeeExchange);
  }

  @Bean
  public Binding deleteEmployeeBinding() {
    return BindingBuilder.bind(deleteEmployeeQueue()).to(deleteEmployeeExchange()).with(deleteEmployeeRoutingKey);
  }
  // </editor-fold>
}
