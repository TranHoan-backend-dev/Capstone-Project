package com.capstone.notification.event.consumer.lateral.publish;

import com.capstone.common.annotation.AppLog;
import com.capstone.notification.event.consumer.BaseEventConsumer;
import com.capstone.notification.event.consumer.lateral.message.UpdateEventMessage;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@AppLog
@Component
public class UpdateLateralConsumer extends BaseEventConsumer<UpdateEventMessage> {
  Logger log;

  @RabbitListener(queues = "${rabbit-mq-config.queue}.lateral.update")
  @Override
  public void handle(UpdateEventMessage event) {
    super.handle(event);
  }

  @Override
  protected String buildMessage(@NonNull UpdateEventMessage event) {
    var data = event.data();
    var response = """
      Phòng IT vừa cập nhật một nhánh tổng:
      Cũ: %s thuộc chi nhánh %s
      Mới: %s thuộc chi nhánh %s""".formatted(data.oldName(), data.oldNetwork(), data.newName(),
      data.newNetwork());
    log.info(response);
    return response;
  }
}
