package com.capstone.notification.event.consumer.page.processing;

import com.capstone.notification.event.consumer.page.message.UpdateEventMessage;
import com.capstone.notification.event.producer.MessageProducer;
import com.capstone.notification.event.consumer.GeneralEventConsumer;
import com.capstone.notification.event.consumer.Topic;
import org.jspecify.annotations.NonNull;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UpdatePageEvent extends GeneralEventConsumer<UpdateEventMessage> {
  public UpdatePageEvent(MessageProducer producer) {
    super(producer);
  }

  @RabbitListener(queues = "${rabbit-mq-config.queue}.${rabbit-mq-config.entities[18]}.${rabbit-mq-config.actions[0]}")
  public void handle(UpdateEventMessage event) {
    super.handle(
      event,
      List.of(Topic.getTopic(Topic.GENERAL)),
      "Ẩn trang web",
      null);
  }

  @Override
  protected String buildMessage(@NonNull UpdateEventMessage event) {
    return """
      Phòng IT chuẩn bị cho ngưng sử dụng trang %s. Nếu bạn đang sử dụng trang này hoặc có dữ liệu cần
      lưu, hãy lưu lại ngay.
      Trang web này sẽ được ẩn đi sau 10 phút tới
      """.formatted(event.data().pageName());
  }
}
