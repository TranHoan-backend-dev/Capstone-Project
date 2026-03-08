package com.capstone.notification.event.consumer.order.processing;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.enumerate.RoleName;
import com.capstone.notification.event.consumer.order.message.ApproveEventMessage;
import com.capstone.notification.event.producer.MessageProducer;
import com.capstone.notification.event.websocket.GeneralEventConsumer;
import com.capstone.notification.event.websocket.Topic;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.List;

@AppLog
@Component
public class ApproveConsumer extends GeneralEventConsumer<ApproveEventMessage> {
  Logger log;

  public ApproveConsumer(MessageProducer producer) {
    super(producer);
  }

  @RabbitListener(queues = "${rabbit-mq-config.queue}.${rabbit-mq-config.entities[13]}.${rabbit-mq-config.actions[3]}")
  public void handle(ApproveEventMessage event) {
    super.handle(
      event,
      List.of(Topic.getTopicOfPlanningTechnicalDepartment(RoleName.SURVEY_STAFF, "/" + event.data().empId())),
      "Bạn vừa mới được giao xử lý đơn chờ thiết kế mới!",
      null);
  }

  @Override
  protected String buildMessage(@NonNull ApproveEventMessage event) {
    var data = event.data();
    var response = """
      Đơn chờ thiết kế vừa mới được giao cho bạn
      Mã đơn: %s
      Số đơn: %s
      Người làm đơn: %s
      Khách hàng: %s
      """.formatted(data.formCode(), data.formNumber(), data.creator(), data.customerName());
    log.info("Response: {}", response);
    return response;
  }
}
