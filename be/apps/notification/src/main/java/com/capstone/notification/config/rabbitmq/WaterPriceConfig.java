package com.capstone.notification.config.rabbitmq;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WaterPriceConfig {
  final String entity = "${rabbit-mq-config.entities[10]}";
  final String updateKeyword = "${keyword.update}";
  final String deleteKeyword = "${keyword.delete}";
  final String exchange = "${keyword.exchange}";
  final String key = "${keyword.key}";
  final String queue = "${keyword.queue}";
  final String updatePrefix = updateKeyword + "_" + entity;
  final String deletePrefix = deleteKeyword + "_" + entity;

  // <editor-fold> desc="Update"
  @Value(updatePrefix + exchange)
  private String updateWaterPriceExchange;

  @Value(updatePrefix + key)
  private String updateWaterPriceRoutingKey;

  @Value(updatePrefix + queue)
  private String updateWaterPriceQueue;

  @Bean
  public Queue updateWaterPriceQueue() {
    return new Queue(updateWaterPriceQueue, true);
  }

  @Bean
  public TopicExchange updateWaterPriceExchange() {
    return new TopicExchange(updateWaterPriceExchange);
  }

  @Bean
  public Binding updateWaterPriceBinding() {
    return BindingBuilder.bind(updateWaterPriceQueue()).to(updateWaterPriceExchange())
      .with(updateWaterPriceRoutingKey);
  }
  // </editor-fold>

  // <editor-fold> desc="Delete"
  @Value(deletePrefix + exchange)
  private String deleteWaterPriceExchange;

  @Value(deletePrefix + key)
  private String deleteWaterPriceRoutingKey;

  @Value(deletePrefix + queue)
  private String deleteWaterPriceQueue;

  @Bean
  public Queue deleteWaterPriceQueue() {
    return new Queue(deleteWaterPriceQueue, true);
  }

  @Bean
  public TopicExchange deleteWaterPriceExchange() {
    return new TopicExchange(deleteWaterPriceExchange);
  }

  @Bean
  public Binding deleteWaterPriceBinding() {
    return BindingBuilder.bind(deleteWaterPriceQueue()).to(deleteWaterPriceExchange())
      .with(deleteWaterPriceRoutingKey);
  }
  // </editor-fold>
}
