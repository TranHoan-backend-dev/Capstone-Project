package com.capstone.notification.event.consumer.calculationunit.processing;

import com.capstone.notification.event.consumer.GeneralEventConsumer;
import com.capstone.notification.event.consumer.Topic;
import com.capstone.notification.event.consumer.calculationunit.message.DeleteUnitEventMessage;
import com.capstone.notification.event.producer.MessageProducer;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Slf4j
@Component
public class DeleteUnitConsumer extends GeneralEventConsumer<DeleteUnitEventMessage> {

  public DeleteUnitConsumer(MessageProducer producer) {
    super(producer);
  }

  @RabbitListener(queues = "${rabbit-mq-config.queue}.${rabbit-mq-config.entities[8]}.${rabbit-mq-config.actions[1]}")
  public void handle(DeleteUnitEventMessage event) {
    var topics = Arrays.asList(
      Topic.getTopic(Topic.PLANNING_TECHNICAL),
      Topic.getTopic(Topic.CONSTRUCTION),
      Topic.getTopic(Topic.BUSINESS));
    super.handle(event, topics, "Xóa đơn vị đo", "");
  }

  @Override
  protected String buildMessage(@NonNull DeleteUnitEventMessage event) {
    var data = event.data();
    var response = "Phòng IT vừa xóa đơn vị đo: '%s'".formatted(data.name());
    log.info(response);
    return response;
  }
}
