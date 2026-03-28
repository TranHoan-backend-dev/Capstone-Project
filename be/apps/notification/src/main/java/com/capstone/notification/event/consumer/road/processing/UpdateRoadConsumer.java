package com.capstone.notification.event.consumer.road.processing;

import com.capstone.common.annotation.AppLog;
import com.capstone.notification.event.producer.MessageProducer;
import com.capstone.notification.event.consumer.GeneralEventConsumer;
import com.capstone.notification.event.consumer.road.message.UpdateEventMessage;
import com.capstone.notification.event.consumer.Topic;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.List;

@AppLog
@Component
public class UpdateRoadConsumer extends GeneralEventConsumer<UpdateEventMessage> {
  Logger log;

  public UpdateRoadConsumer(MessageProducer producer) {
    super(producer);
  }

  @RabbitListener(queues = "${rabbit-mq-config.queue}.road.update")
  public void handle(UpdateEventMessage event) {
    super.handle(
      event,
      List.of(Topic.getTopic(Topic.GENERAL)),
      "Cập nhật đường phố",
      null
    );
  }

  @Override
  protected String buildMessage(@NonNull UpdateEventMessage event) {
    var data = event.data();
    var response = """
      Phòng IT vừa cập nhật một tên đường:
      Cũ: %s
      Mới: %s""".formatted(data.oldName(), data.newName());
    log.info(response);
    return response;
  }
}
