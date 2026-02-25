package com.capstone.notification.event.consumer.commune.publish;

import com.capstone.notification.event.consumer.BaseEventConsumer;
import com.capstone.notification.event.consumer.commune.message.UpdateEventMessage;

import lombok.extern.slf4j.Slf4j;

import org.jspecify.annotations.NonNull;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class UpdateCommuneConsumer extends BaseEventConsumer<UpdateEventMessage> {

  @RabbitListener(queues = "${rabbit-mq-config.queue}.commune.update")
  @Override
  public void handle(UpdateEventMessage event) {
    super.handle(event);
  }

  @Override
  protected String buildMessage(@NonNull UpdateEventMessage event) {
    var data = event.data();
    var response = """
        Phòng IT vừa cập nhật một đơn vị hành chính:
        Cũ: %s, loại %s
        Mới: %s, loại %s""".formatted(data.oldName(), data.oldType(), data.newName(), data.newType());
    log.info(response);
    return response;
  }
}
