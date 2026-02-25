package com.capstone.notification.event.consumer.road.publish;

import com.capstone.common.annotation.AppLog;
import com.capstone.notification.event.consumer.BaseEventConsumer;
import com.capstone.notification.event.consumer.road.message.UpdateEventMessage;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@AppLog
@Component
public class UpdateRoadConsumer extends BaseEventConsumer<UpdateEventMessage> {
  Logger log;

  @RabbitListener(queues = "${rabbit-mq-config.queue}.road.update")
  @Override
  public void handle(UpdateEventMessage event) {
    super.handle(event);
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
