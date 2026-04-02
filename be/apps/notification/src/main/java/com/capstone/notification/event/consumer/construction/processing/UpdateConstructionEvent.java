package com.capstone.notification.event.consumer.construction.processing;

import com.capstone.common.enumerate.RoleName;
import com.capstone.notification.event.consumer.GeneralEventConsumer;
import com.capstone.notification.event.consumer.Topic;
import com.capstone.notification.event.consumer.construction.message.UpdateMessage;
import com.capstone.notification.event.producer.MessageProducer;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
public class UpdateEvent extends GeneralEventConsumer<UpdateMessage> {
  public UpdateEvent(MessageProducer producer) {
    super(producer);
  }

  @RabbitListener(queues = "${rabbit-mq-config.queue}.${rabbit-mq-config.entities[17]}.${rabbit-mq-config.actions[0]}")
  public void handle(UpdateMessage event) {
    super.handle(
      event,
      List.of(Topic.getTopicOfConstructionDepartment(RoleName.CONSTRUCTION_DEPARTMENT_HEAD, "")),
      "Cập nhật đơn chờ thi công",
      null
    );
  }

  @Override
  protected String buildMessage(@NonNull UpdateMessage event) {
    var data = event.data();
    var message = """
      Đơn chờ thi công vừa được chỉnh sửa đội trưởng đội thi công
      Số đơn: %s
      Mã đơn: %s
      Đội trưởng đội thi công được chỉ định là %s
      """.formatted(data.formNumber(), data.formCode(), data.constructionCaptain());
    log.info(message);
    return message;
  }
}
