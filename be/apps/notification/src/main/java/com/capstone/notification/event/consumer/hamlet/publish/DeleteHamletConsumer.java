package com.capstone.notification.event.consumer.hamlet.publish;

import com.capstone.notification.event.consumer.BaseEventConsumer;
import com.capstone.notification.event.consumer.hamlet.message.DeleteEventMessage;
import org.jspecify.annotations.NonNull;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class DeleteHamletConsumer extends BaseEventConsumer<DeleteEventMessage> {

  @RabbitListener(queues = "${keyword.delete}_${rabbit-mq-config.entities[4]}_${keyword.queue}")
  @Override
  public void handle(DeleteEventMessage event) {
    super.handle(event);
  }

  @Override
  protected String buildMessage(@NonNull DeleteEventMessage event) {
    var data = event.data();
    return "Phòng IT vừa xóa đơn vị hành chính tuyến xã: %s %s, xã %s".formatted(
      data.type().equals("hamlet") ? "Thôn" : "Làng",
      data.name(),
      data.commune());
  }
}
