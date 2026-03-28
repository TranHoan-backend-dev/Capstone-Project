package com.capstone.notification.event.consumer.neighborhoodunit.processing;

import com.capstone.common.annotation.AppLog;
import com.capstone.notification.event.producer.MessageProducer;
import com.capstone.notification.event.consumer.GeneralEventConsumer;
import com.capstone.notification.event.consumer.neighborhoodunit.message.DeleteEventMessage;
import com.capstone.notification.event.consumer.Topic;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.List;

@AppLog
@Component
public class DeleteNeighborhoodUnitConsumer extends GeneralEventConsumer<DeleteEventMessage> {
  Logger log;

  public DeleteNeighborhoodUnitConsumer(MessageProducer producer) {
    super(producer);
  }

  @RabbitListener(queues = "${rabbit-mq-config.queue}.neighborhood-unit.delete")
  public void handle(DeleteEventMessage event) {
    super.handle(
      event,
      List.of(Topic.getTopic(Topic.GENERAL)),
      "Xóa tổ/khu/xóm",
      null
    );
  }

  @Override
  protected String buildMessage(@NonNull DeleteEventMessage event) {
    var data = event.data();
    var response = "Phòng IT vừa xóa tổ dân phố %s thuộc chi nhánh %s".formatted(data.name(), data.network());
    log.info(response);
    return response;
  }
}
