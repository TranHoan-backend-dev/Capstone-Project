package com.capstone.notification.event.consumer.lateral.publish;

import com.capstone.common.annotation.AppLog;
import com.capstone.notification.event.websocket.GeneralEventConsumer;
import com.capstone.notification.event.consumer.lateral.message.UpdateEventMessage;
import com.capstone.notification.event.websocket.Topic;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.List;

@AppLog
@Component
public class UpdateLateralConsumer extends GeneralEventConsumer<UpdateEventMessage> {
  Logger log;

  @RabbitListener(queues = "${rabbit-mq-config.queue}.lateral.update")
  @Override
  public void handle(UpdateEventMessage event, @NonNull List<String> topics, String title) {
    super.handle(event, List.of(Topic.getTopic(Topic.GENERAL)), "Cập nhật nhánh tổng");
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
