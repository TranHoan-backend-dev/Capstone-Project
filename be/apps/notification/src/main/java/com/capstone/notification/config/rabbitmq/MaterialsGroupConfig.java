package com.capstone.notification.config.rabbitmq;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MaterialsGroupConfig {
  final String entity = "${rabbit-mq-config.entities[7]}";
  final String deleteKeyword = "${keyword.delete}";
  final String exchange = "${keyword.exchange}";
  final String key = "${keyword.key}";
  final String queue = "${keyword.queue}";
  final String deletePrefix = deleteKeyword + "_" + entity;

  @Value(deletePrefix + exchange)
  private String deleteMaterialsGroupExchange;

  @Value(deletePrefix + key)
  private String deleteMaterialsGroupRoutingKey;

  @Value(deletePrefix + queue)
  private String deleteMaterialsGroupQueue;

  @Bean
  public Queue deleteMaterialsGroupQueue() {
    return new Queue(deleteMaterialsGroupQueue, true);
  }

  @Bean
  public TopicExchange deleteMaterialsGroupExchange() {
    return new TopicExchange(deleteMaterialsGroupExchange);
  }

  @Bean
  public Binding deleteMaterialsGroupBinding() {
    return BindingBuilder.bind(deleteMaterialsGroupQueue()).to(deleteMaterialsGroupExchange())
      .with(deleteMaterialsGroupRoutingKey);
  }
}
