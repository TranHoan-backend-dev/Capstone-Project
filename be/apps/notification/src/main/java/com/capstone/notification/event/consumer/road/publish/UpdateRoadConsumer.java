package com.capstone.notification.event.consumer.road.publish;

import com.capstone.notification.event.consumer.BaseEventConsumer;
import com.capstone.notification.event.consumer.road.message.UpdateEventMessage;
import org.jspecify.annotations.NonNull;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class UpdateRoadConsumer extends BaseEventConsumer<UpdateEventMessage> {

  @RabbitListener(queues = "${keyword.update}_${rabbit-mq-config.entities[3]}_${keyword.queue}")
  @Override
  public void handle(UpdateEventMessage event) {
    super.handle(event);
  }

  @Override
  protected String buildMessage(@NonNull UpdateEventMessage event) {
    var data = event.data();
    return """
      Phòng IT vừa cập nhật một tên đường:
      Cũ: %s
      Mới: %s""".formatted(data.oldName(), data.newName());
  }
}
