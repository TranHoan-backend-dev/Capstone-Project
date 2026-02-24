package com.capstone.notification.event.consumer.road.publish;

import com.capstone.common.annotation.AppLog;
import com.capstone.notification.event.consumer.BaseEventConsumer;
import com.capstone.notification.event.consumer.road.message.DeleteEventMessage;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@AppLog
@Component
public class DeleteRoadConsumer extends BaseEventConsumer<DeleteEventMessage> {
  Logger log;

  @RabbitListener(queues = "${rabbit-mq-config.queue}.road.delete")
  @Override
  public void handle(DeleteEventMessage event) {
    super.handle(event);
  }

  @Override
  protected String buildMessage(@NonNull DeleteEventMessage event) {
    var data = event.data();
    var response = "Phòng IT vừa xóa đường %s".formatted(data.name());
    log.info(response);
    return response;
  }
}
