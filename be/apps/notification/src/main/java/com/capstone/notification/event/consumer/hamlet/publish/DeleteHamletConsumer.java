package com.capstone.notification.event.consumer.hamlet.publish;

import com.capstone.common.annotation.AppLog;
import com.capstone.notification.event.consumer.BaseEventConsumer;
import com.capstone.notification.event.consumer.hamlet.message.DeleteEventMessage;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@AppLog
@Component
public class DeleteHamletConsumer extends BaseEventConsumer<DeleteEventMessage> {
  Logger log;

  @RabbitListener(queues = "${rabbit-mq-config.queue}.hamlet.delete")
  @Override
  public void handle(DeleteEventMessage event) {
    super.handle(event);
  }

  @Override
  protected String buildMessage(@NonNull DeleteEventMessage event) {
    var data = event.data();
    var response = "Phòng IT vừa xóa đơn vị hành chính tuyến xã: %s %s, xã %s".formatted(
      data.type().equals("hamlet") ? "Thôn" : "Làng",
      data.name(),
      data.commune());
    log.info(response);
    return response;
  }
}
