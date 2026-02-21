package com.capstone.notification.event.consumer.neighborhoodunit.publish;

import com.capstone.notification.event.consumer.BaseEventConsumer;
import com.capstone.notification.event.consumer.neighborhoodunit.message.DeleteEventMessage;
import org.jspecify.annotations.NonNull;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class DeleteUnitConsumer extends BaseEventConsumer<DeleteEventMessage> {

  @RabbitListener(queues = "${keyword.delete}_${rabbit-mq-config.entities[2]}_${keyword.queue}")
  @Override
  public void handle(DeleteEventMessage event) {
    super.handle(event);
  }

  @Override
  protected String buildMessage(@NonNull DeleteEventMessage event) {
    var data = event.data();
    return "Phòng IT vừa xóa tổ dân phố %s thuộc chi nhánh %s".formatted(data.name(), data.network());
  }
}
