package com.capstone.notification.event.consumer.hamlet.publish;

import com.capstone.notification.event.consumer.BaseEventConsumer;
import com.capstone.notification.event.consumer.hamlet.message.UpdateEventMessage;
import org.jspecify.annotations.NonNull;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class UpdateHamletConsumer extends BaseEventConsumer<UpdateEventMessage> {

  @RabbitListener(queues = "${rabbit-mq-config.update-hamlet.queue_name}")
  @Override
  public void handle(UpdateEventMessage event) {
    super.handle(event);
  }

  @Override
  protected String buildMessage(@NonNull UpdateEventMessage event) {
    var data = event.data();
    return """
      Phòng IT vừa cập nhật một đơn vị hành chính tuyến xã:
      Cũ: %s %s, xã %s
      Mới: %s %s, xã %s""".formatted(
      data.oldType().equals("hamlet") ? "Thôn" : "Làng", data.oldName(), data.oldCommune(),
      data.newType().equals("hamlet") ? "Thôn" : "Làng", data.newName(), data.newCommune());
  }
}
