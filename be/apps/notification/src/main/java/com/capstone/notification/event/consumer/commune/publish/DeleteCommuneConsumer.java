package com.capstone.notification.event.consumer.commune.publish;

import com.capstone.notification.event.consumer.BaseEventConsumer;
import com.capstone.notification.event.consumer.commune.message.DeleteEventMessage;

import lombok.extern.slf4j.Slf4j;

import org.jspecify.annotations.NonNull;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class DeleteCommuneConsumer extends BaseEventConsumer<DeleteEventMessage> {

  @RabbitListener(queues = "${rabbit-mq-config.queue}.commune.delete")
  @Override
  public void handle(DeleteEventMessage event) {
    super.handle(event);
  }

  @Override
  protected String buildMessage(@NonNull DeleteEventMessage event) {
    var data = event.data();
    var response = "Phòng IT vừa xóa đơn vị hành chính %s, loại %s".formatted(data.name(), data.type());
    log.info(response);
    return response;
  }
}
