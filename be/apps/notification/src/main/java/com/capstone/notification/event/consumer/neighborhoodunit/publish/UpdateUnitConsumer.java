package com.capstone.notification.event.consumer.neighborhoodunit.publish;

import com.capstone.common.annotation.AppLog;
import com.capstone.notification.event.producer.MessageProducer;
import com.capstone.notification.event.websocket.GeneralEventConsumer;
import com.capstone.notification.event.consumer.neighborhoodunit.message.UpdateEventMessage;
import com.capstone.notification.event.websocket.Topic;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.List;

@AppLog
@Component
public class UpdateUnitConsumer extends GeneralEventConsumer<UpdateEventMessage> {
  Logger log;

  public UpdateUnitConsumer(MessageProducer producer) {
    super(producer);
  }

  @RabbitListener(queues = "${rabbit-mq-config.queue}.neighborhood-unit.update")
  public void handle(UpdateEventMessage event) {
    super.handle(
      event,
      List.of(Topic.getTopic(Topic.GENERAL)),
      "Cập nhật tổ/khu/xóm",
      null
    );
  }

  @Override
  protected String buildMessage(@NonNull UpdateEventMessage event) {
    var data = event.data();
    var response = """
      Phòng IT vừa cập nhật một tổ dân phố
      Cũ: %s thuộc chi nhánh %s
      Mới: %s thuộc chi nhánh %s
      """.formatted(
      data.oldName(), data.oldCommune(),
      data.newName(), data.newCommune());
    log.info(response);
    return response;
  }
}
