package com.capstone.notification.event.consumer.commune.publish;

import com.capstone.common.annotation.AppLog;
import com.capstone.notification.event.producer.MessageProducer;
import com.capstone.notification.event.websocket.GeneralEventConsumer;
import com.capstone.notification.event.consumer.commune.message.UpdateEventMessage;

import com.capstone.notification.event.websocket.Topic;

import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.List;

@AppLog
@Component
public class UpdateCommuneConsumer extends GeneralEventConsumer<UpdateEventMessage> {
  Logger log;

  public UpdateCommuneConsumer(MessageProducer producer) {
    super(producer);
  }

  @RabbitListener(queues = "${rabbit-mq-config.queue}.commune.update")
  public void handle(UpdateEventMessage event) {
    super.handle(
      event,
      List.of(Topic.getTopic(Topic.GENERAL)),
      "Cập nhật đơn vị hành chính thành phố",
      null
    );
  }

  @Override
  protected String buildMessage(@NonNull UpdateEventMessage event) {
    var data = event.data();
    var response = """
      Phòng IT vừa cập nhật một đơn vị hành chính:
      Cũ: %s, loại %s
      Mới: %s, loại %s""".formatted(data.oldName(), data.oldType(), data.newName(), data.newType());
    log.info(response);
    return response;
  }
}
