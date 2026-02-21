package com.capstone.notification.event.consumer.neighborhoodunit.publish;

import com.capstone.notification.event.consumer.BaseEventConsumer;
import com.capstone.notification.event.consumer.neighborhoodunit.message.UpdateEventMessage;
import org.jspecify.annotations.NonNull;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class UpdateUnitConsumer extends BaseEventConsumer<UpdateEventMessage> {

  @RabbitListener(queues = "${keyword.update}_${rabbit-mq-config.entities[2]}_${keyword.queue}")
  @Override
  public void handle(UpdateEventMessage event) {
    super.handle(event);
  }

  @Override
  protected String buildMessage(@NonNull UpdateEventMessage event) {
    var data = event.data();
    return """
      Phòng IT vừa cập nhật một tổ dân phố
      Cũ: %s thuộc chi nhánh %s
      Mới: %s thuộc chi nhánh %s
      """.formatted(
      data.oldName(), data.oldNetwork(),
      data.newName(), data.newNetwork());
  }
}
