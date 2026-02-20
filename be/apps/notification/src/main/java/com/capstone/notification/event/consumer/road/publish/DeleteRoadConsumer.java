package com.capstone.notification.event.consumer.road.publish;

import com.capstone.notification.event.consumer.BaseEventConsumer;
import com.capstone.notification.event.consumer.road.message.DeleteEventMessage;
import org.jspecify.annotations.NonNull;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class DeleteRoadConsumer extends BaseEventConsumer<DeleteEventMessage> {

  @RabbitListener(queues = "${rabbit-mq-config.delete-road.queue_name}")
  @Override
  public void handle(DeleteEventMessage event) {
    super.handle(event);
  }

  @Override
  protected String buildMessage(@NonNull DeleteEventMessage event) {
    var data = event.data();
    return "Phòng IT vừa xóa đường %s".formatted(data.name());
  }
}
