package com.capstone.notification.event.consumer.commune.publish;

import com.capstone.common.annotation.AppLog;
import com.capstone.notification.event.producer.MessageProducer;
import com.capstone.notification.event.websocket.GeneralEventConsumer;
import com.capstone.notification.event.consumer.commune.message.DeleteEventMessage;

import com.capstone.notification.event.websocket.Topic;

import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.List;

@AppLog
@Component
public class DeleteCommuneConsumer extends GeneralEventConsumer<DeleteEventMessage> {
  Logger log;

  public DeleteCommuneConsumer(MessageProducer producer) {
    super(producer);
  }

  @RabbitListener(queues = "${rabbit-mq-config.queue}.commune.delete")
  public void handle(DeleteEventMessage event) {
    super.handle(
      event,
      List.of(Topic.getTopic(Topic.GENERAL)),
      "Xóa đơn vị hành chính thành phố",
      null
    );
  }

  @Override
  protected String buildMessage(@NonNull DeleteEventMessage event) {
    var data = event.data();
    var response = "Phòng IT vừa xóa đơn vị hành chính %s, loại %s".formatted(data.name(), data.type());
    log.info(response);

    return response;
  }
}
