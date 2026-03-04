package com.capstone.notification.event.consumer.hamlet.processing;

import com.capstone.common.annotation.AppLog;
import com.capstone.notification.event.producer.MessageProducer;
import com.capstone.notification.event.websocket.GeneralEventConsumer;
import com.capstone.notification.event.consumer.hamlet.message.UpdateEventMessage;
import com.capstone.notification.event.websocket.Topic;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.List;

@AppLog
@Component
public class UpdateHamletConsumer extends GeneralEventConsumer<UpdateEventMessage> {
  Logger log;

  public UpdateHamletConsumer(MessageProducer producer) {
    super(producer);
  }

  @RabbitListener(queues = "${rabbit-mq-config.queue}.hamlet.update")
  public void handle(UpdateEventMessage event) {
    super.handle(
      event,
      List.of(Topic.getTopic(Topic.GENERAL)),
      "Cập nhật đơn vị hành chính xã",
      null
    );
  }

  @Override
  protected String buildMessage(@NonNull UpdateEventMessage event) {
    var data = event.data();
    var response = """
      Phòng IT vừa cập nhật một đơn vị hành chính tuyến xã:
      Cũ: %s %s, xã %s
      Mới: %s %s, xã %s""".formatted(
      data.oldType().equals("hamlet") ? "Thôn" : "Làng", data.oldName(), data.oldCommune(),
      data.newType().equals("hamlet") ? "Thôn" : "Làng", data.newName(), data.newCommune());
    log.info(response);
    return response;
  }
}
