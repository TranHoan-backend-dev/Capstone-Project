package com.capstone.notification.config.rabbitmq;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RoadConfig {
  final String entity = "${rabbit-mq-config.entities[3]}";
  final String updateKeyword = "${keyword.update}";
  final String deleteKeyword = "${keyword.delete}";
  final String exchange = "${keyword.exchange}";
  final String key = "${keyword.key}";
  final String queue = "${keyword.queue}";
  final String updatePrefix = updateKeyword + "_" + entity;
  final String deletePrefix = deleteKeyword + "_" + entity;

  // <editor-fold> desc="Update"
  @Value(updatePrefix + exchange)
  private String updateRoadExchange;

  @Value(updatePrefix + key)
  private String updateRoadRoutingKey;

  @Value(updatePrefix + queue)
  private String updateRoadQueue;

  @Bean
  public Queue updateRoadQueue() {
    return new Queue(updateRoadQueue, true);
  }

  @Bean
  public TopicExchange updateRoadExchange() {
    return new TopicExchange(updateRoadExchange);
  }

  @Bean
  public Binding updateRoadBinding() {
    return BindingBuilder.bind(updateRoadQueue()).to(updateRoadExchange()).with(updateRoadRoutingKey);
  }
  // </editor-fold>

  // <editor-fold> desc="Delete"
  @Value(deletePrefix + exchange)
  private String deleteRoadExchange;

  @Value(deletePrefix + key)
  private String deleteRoadRoutingKey;

  @Value(deletePrefix + queue)
  private String deleteRoadQueue;

  @Bean
  public Queue deleteRoadQueue() {
    return new Queue(deleteRoadQueue, true);
  }

  @Bean
  public TopicExchange deleteRoadExchange() {
    return new TopicExchange(deleteRoadExchange);
  }

  @Bean
  public Binding deleteRoadBinding() {
    return BindingBuilder.bind(deleteRoadQueue()).to(deleteRoadExchange()).with(deleteRoadRoutingKey);
  }
  // </editor-fold>
}
