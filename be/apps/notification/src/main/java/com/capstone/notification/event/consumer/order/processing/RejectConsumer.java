package com.capstone.notification.event.consumer.order.processing;

import com.capstone.common.enumerate.RoleName;
import com.capstone.notification.event.consumer.order.message.RejectEventMessage;
import com.capstone.notification.event.producer.MessageProducer;
import com.capstone.notification.event.websocket.GeneralEventConsumer;
import com.capstone.notification.event.websocket.Topic;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RejectConsumer extends GeneralEventConsumer<RejectEventMessage> {
  Logger log;

  public RejectConsumer(MessageProducer producer) {
    super(producer);
  }

  @RabbitListener(queues = "${rabbit-mq-config.queue}.${rabbit-mq-config.entities[13]}.${rabbit-mq-config.actions[3]}")
  public void handle(RejectEventMessage event) {
    super.handle(
      event,
      List.of(Topic.getTopicOfPlanningTechnicalDepartment(RoleName.ORDER_RECEIVING_STAFF, "/" + event.data().empId())),
      "Đơn chờ thiết kế đã bị hủy",
      null);
  }

  @Override
  protected String buildMessage(@NonNull RejectEventMessage event) {
    var data = event.data();
    var response = """
      Đơn chờ thiết kế vừa mới bị hủy bởi Trưởng phòng
      Mã đơn: %s
      Số đơn: %s
      Khách hàng: %s
      """.formatted(data.formCode(), data.formNumber(), data.customerName());
    log.info("Response: {}", response);
    return response;
  }
}
