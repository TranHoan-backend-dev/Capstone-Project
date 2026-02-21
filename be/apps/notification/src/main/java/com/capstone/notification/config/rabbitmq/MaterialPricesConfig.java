package com.capstone.notification.config.rabbitmq;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MaterialPricesConfig {
  final String entity = "${rabbit-mq-config.entities[5]}";
  final String updateKeyword = "${keyword.update}";
  final String deleteKeyword = "${keyword.delete}";
  final String exchange = "${keyword.exchange}";
  final String key = "${keyword.key}";
  final String queue = "${keyword.queue}";
  final String updatePrefix = updateKeyword + "_" + entity;
  final String deletePrefix = deleteKeyword + "_" + entity;

  // <editor-fold> desc="Update"
  @Value(updatePrefix + exchange)
  private String updateMaterialPricesExchange;

  @Value(updatePrefix + key)
  private String updateMaterialPricesRoutingKey;

  @Value(updatePrefix + queue)
  private String updateMaterialPricesQueue;

  @Bean
  public Queue updateMaterialPricesQueue() {
    return new Queue(updateMaterialPricesQueue, true);
  }

  @Bean
  public TopicExchange updateMaterialPricesExchange() {
    return new TopicExchange(updateMaterialPricesExchange);
  }

  @Bean
  public Binding updateMaterialPricesBinding() {
    return BindingBuilder.bind(updateMaterialPricesQueue()).to(updateMaterialPricesExchange())
      .with(updateMaterialPricesRoutingKey);
  }
  // </editor-fold>

  // <editor-fold> desc="Delete"
  @Value(deletePrefix + exchange)
  private String deleteMaterialPricesExchange;

  @Value(deletePrefix + key)
  private String deleteMaterialPricesRoutingKey;

  @Value(deletePrefix + queue)
  private String deleteMaterialPricesQueue;

  @Bean
  public Queue deleteMaterialPricesQueue() {
    return new Queue(deleteMaterialPricesQueue, true);
  }

  @Bean
  public TopicExchange deleteMaterialPricesExchange() {
    return new TopicExchange(deleteMaterialPricesExchange);
  }

  @Bean
  public Binding deleteMaterialPricesBinding() {
    return BindingBuilder.bind(deleteMaterialPricesQueue()).to(deleteMaterialPricesExchange())
      .with(deleteMaterialPricesRoutingKey);
  }
  // </editor-fold>
}
