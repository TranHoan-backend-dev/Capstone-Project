package com.capstone.notification.event.consumer.construction.processing;

import com.capstone.common.enumerate.RoleName;
import com.capstone.notification.event.consumer.GeneralEventConsumer;
import com.capstone.notification.event.consumer.Topic;
import com.capstone.notification.event.consumer.construction.message.ApproveMessage;
import com.capstone.notification.event.consumer.construction.message.AssignMessage;
import com.capstone.notification.event.producer.MessageProducer;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
public class AssignConstructionEvent extends GeneralEventConsumer<AssignMessage> {
  public AssignConstructionEvent(MessageProducer producer) {
    super(producer);
  }

  @RabbitListener(queues = "${rabbit-mq-config.queue}.${rabbit-mq-config.entities[17]}.${rabbit-mq-config.actions[2]}")
  public void handle(AssignMessage event) {
    super.handle(
      event,
      List.of(Topic.getTopicOfConstructionDepartment(RoleName.CONSTRUCTION_DEPARTMENT_HEAD, "")),
      "Đơn chờ thi công mới",
      null
    );
  }

  @Override
  protected String buildMessage(@NonNull AssignMessage event) {
    var data = event.data();
    var message = """
      Đơn chờ thi công mới được tạo và giao cho đội trưởng đội thi công %s
      Số đơn: %s
      Mã đơn: %s
      """.formatted(data.empId(), data.formNumber(), data.formCode());
    log.info(message);
    return message;
  }
}
