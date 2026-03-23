package com.capstone.notification.event.consumer.construction.processing;

import com.capstone.common.enumerate.RoleName;
import com.capstone.notification.event.consumer.construction.message.ApproveMessage;
import com.capstone.notification.event.producer.MessageProducer;
import com.capstone.notification.event.websocket.GeneralEventConsumer;
import com.capstone.notification.event.websocket.Topic;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
public class ApprovedConstructionEvent extends GeneralEventConsumer<ApproveMessage> {
  public ApprovedConstructionEvent(MessageProducer producer) {
    super(producer);
  }

  @RabbitListener(queues = "${rabbit-mq-config.queue}.${rabbit-mq-config.entities[17]}.${rabbit-mq-config.actions[3]}")
  public void handle(ApproveMessage event) {
    super.handle(
      event,
      List.of(Topic.getTopicOfConstructionDepartment(RoleName.CONSTRUCTION_DEPARTMENT_STAFF, "")),
      "Công trình được nghiệm thu",
      null
    );
  }

  @Override
  protected String buildMessage(@NonNull ApproveMessage event) {
    var data = event.data();
    var message = """
      Công trình được thi công bởi đội trưởng %s đã được phòng Kế hoạch - Kỹ thuật nghiệm thu
      Số đơn: %s
      Mã đơn: %s
      """.formatted(data.constructionCaptain(), data.formNumber(), data.formCode());
    log.info(message);
    return message;
  }
}
