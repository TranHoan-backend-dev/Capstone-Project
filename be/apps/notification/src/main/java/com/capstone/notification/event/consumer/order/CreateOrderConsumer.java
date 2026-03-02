package com.capstone.notification.event.consumer.order;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.enumerate.RoleName;
import com.capstone.notification.event.consumer.order.message.CreateEventMessage;
import com.capstone.notification.event.producer.MessageProducer;
import com.capstone.notification.event.websocket.GeneralEventConsumer;
import com.capstone.notification.event.websocket.Topic;
import org.slf4j.Logger;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.List;

@AppLog
@Component
public class CreateOrderConsumer extends GeneralEventConsumer<CreateEventMessage> {
  Logger log;

  public CreateOrderConsumer(MessageProducer producer) {
    super(producer);
  }

  @RabbitListener(queues = "${rabbit-mq-config.queue}.${rabbit-mq-config.entities[13]}.${rabbit-mq-config.actions[2]}")
  public void handle(CreateEventMessage event) {
    super.handle(
      event,
      List.of(Topic.getTopicOfPlanningTechnicalDepartment(RoleName.PLANNING_TECHNICAL_DEPARTMENT_HEAD)),
      "",
      null
    );
  }

  @Override
  protected String buildMessage(CreateEventMessage event) {
    return "";
  }
}
