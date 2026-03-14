package com.capstone.notification.event.consumer.hamlet.processing;

import com.capstone.notification.event.producer.MessageProducer;
import com.capstone.notification.event.websocket.GeneralEventConsumer;
import com.capstone.notification.event.consumer.hamlet.message.DeleteEventMessage;
import com.capstone.notification.event.websocket.Topic;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
public class DeleteHamletConsumer extends GeneralEventConsumer<DeleteEventMessage> {

  public DeleteHamletConsumer(MessageProducer producer) {
    super(producer);
  }

  @RabbitListener(queues = "${rabbit-mq-config.queue}.hamlet.delete")
  public void handle(DeleteEventMessage event) {
    super.handle(
      event,
      List.of(Topic.getTopic(Topic.GENERAL)),
      "Xóa đơn vị hành chính xã",
      null
    );
  }

  @Override
  protected String buildMessage(@NonNull DeleteEventMessage event) {
    var data = event.data();
    var response = "Phòng IT vừa xóa đơn vị hành chính tuyến xã: %s %s, xã %s".formatted(
      data.type().equals("hamlet") ? "Thôn" : "Làng",
      data.name(),
      data.commune());
    log.info(response);
    return response;
  }
}
