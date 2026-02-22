package com.capstone.notification.event.consumer.lateral.publish;

import com.capstone.common.annotation.AppLog;
import com.capstone.notification.event.consumer.BaseEventConsumer;
import com.capstone.notification.event.consumer.lateral.message.DeleteEventMessage;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@AppLog
@Component
public class DeleteLateralConsumer extends BaseEventConsumer<DeleteEventMessage> {
  Logger log;

  @RabbitListener(queues = "${rabbit-mq-config.queue}.lateral.delete")
  @Override
  public void handle(DeleteEventMessage event) {
    super.handle(event);
  }

  @Override
  protected String buildMessage(@NonNull DeleteEventMessage event) {
    var data = event.data();
    var response = "Phòng IT vừa xóa nhánh tổng %s thuộc chi nhánh %s".formatted(data.name(), data.network());
    log.info(response);
    return response;
  }
}
