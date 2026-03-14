package com.capstone.notification.event.consumer.order.processing;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.enumerate.RoleName;
import com.capstone.notification.event.consumer.order.message.AssignEventMessage;
import com.capstone.notification.event.consumer.order.message.CreateEventMessage;
import com.capstone.notification.event.producer.MessageProducer;
import com.capstone.notification.event.websocket.GeneralEventConsumer;
import com.capstone.notification.event.websocket.Topic;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@AppLog
@Component
public class AssignOrderConsumer extends GeneralEventConsumer<AssignEventMessage> {
  private Logger log;

  public AssignOrderConsumer(SimpMessagingTemplate template, MessageProducer producer) {
    super(producer);
    this.messagingTemplate = template;
  }

  @RabbitListener(queues = "${rabbit-mq-config.queue}.${rabbit-mq-config.entities[13]}.${rabbit-mq-config.actions[4]}")
  public void handle(AssignEventMessage event) {
    super.handle(
      event,
      List.of(Topic.getTopicOfPlanningTechnicalDepartment(RoleName.SURVEY_STAFF, "/" + event.data().empId())),
      "Đơn lắp đặt mới vừa được giao khảo sát",
      null);
  }

  @Override
  protected String buildMessage(@NonNull AssignEventMessage event) {
    var data = event.data();
    var response = """
        Đơn lắp đặt mới vừa được giao cho bạn!
        Thông tin đơn:
        - Mã đơn: %s
        - Số đơn: %s
      """.formatted(data.formCode(), data.formNumber());
    log.info(response);

    return response;
  }
}
