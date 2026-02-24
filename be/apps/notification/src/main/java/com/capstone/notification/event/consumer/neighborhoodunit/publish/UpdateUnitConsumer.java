package com.capstone.notification.event.consumer.neighborhoodunit.publish;

import com.capstone.common.annotation.AppLog;
import com.capstone.notification.event.consumer.BaseEventConsumer;
import com.capstone.notification.event.consumer.neighborhoodunit.message.UpdateEventMessage;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@AppLog
@Component
public class UpdateUnitConsumer extends BaseEventConsumer<UpdateEventMessage> {
  Logger log;

  @RabbitListener(queues = "${rabbit-mq-config.queue}.neighborhood-unit.update")
  @Override
  public void handle(UpdateEventMessage event) {
    super.handle(event);
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
