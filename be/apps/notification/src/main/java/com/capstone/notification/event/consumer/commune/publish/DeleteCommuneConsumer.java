package com.capstone.notification.event.consumer.commune.publish;

import com.capstone.notification.event.consumer.BaseEventConsumer;
import com.capstone.notification.event.consumer.commune.message.DeleteEventMessage;
import org.jspecify.annotations.NonNull;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class DeleteCommuneConsumer extends BaseEventConsumer<DeleteEventMessage> {

  @RabbitListener(queues = "${rabbit-mq-config.delete-commune.queue_name}")
  @Override
  public void handle(DeleteEventMessage event) {
    super.handle(event);
  }

  @Override
  protected String buildMessage(@NonNull DeleteEventMessage event) {
    var data = event.data();
    return "Phòng IT vừa xóa đơn vị hành chính %s, loại %s".formatted(data.name(), data.type());
  }
}
