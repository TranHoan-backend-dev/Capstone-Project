package com.capstone.notification.event.consumer.parameter.processing;

import com.capstone.notification.event.consumer.GeneralEventConsumer;
import com.capstone.notification.event.consumer.Topic;
import com.capstone.notification.event.consumer.parameter.message.UpdateEventMessage;
import com.capstone.notification.event.producer.MessageProducer;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class UpdateParameterConsumer extends GeneralEventConsumer<UpdateEventMessage> {
  private static final Logger log = LoggerFactory.getLogger(UpdateParameterConsumer.class);

  public UpdateParameterConsumer(MessageProducer producer) {
    super(producer);
  }

  @RabbitListener(queues = "${rabbit-mq-config.queue}.${rabbit-mq-config.entities[9]}.${rabbit-mq-config.actions[0]}")
  public void handle(UpdateEventMessage event) {
    log.info("Received update parameter event: {}", event);
    var topics = Arrays.asList(
      Topic.getTopic(Topic.PLANNING_TECHNICAL),
      Topic.getTopic(Topic.CONSTRUCTION));
    super.handle(event, topics, "Cập nhật tham số hệ thống", "");
  }

  @Override
  protected String buildMessage(@NonNull UpdateEventMessage event) {
    var data = event.data();
    if (data.oldName().equals(data.newName())) {
      return "Phòng IT vừa cập nhật tham số '%s': %s -> %s"
        .formatted(data.newName(), data.oldValue(), data.newValue());
    } else {
      return "Phòng IT vừa cập nhật tham số: '%s' (%s) thành '%s' (%s)"
        .formatted(data.oldName(), data.oldValue(), data.newName(), data.newValue());
    }
  }
}
