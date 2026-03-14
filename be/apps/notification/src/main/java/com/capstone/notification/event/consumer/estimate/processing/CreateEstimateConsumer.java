package com.capstone.notification.event.consumer.estimate.processing;

import com.capstone.common.enumerate.RoleName;
import com.capstone.notification.event.consumer.estimate.message.CreateEventMessage;
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
public class CreateEstimateConsumer extends GeneralEventConsumer<CreateEventMessage> {

  public CreateEstimateConsumer(MessageProducer producer) {
    super(producer);
  }

  @RabbitListener(queues = "${rabbit-mq-config.queue}.${rabbit-mq-config.entities[14]}.${rabbit-mq-config.actions[2]}")
  public void handle(CreateEventMessage event) {
    super.handle(
      event,
      List.of(Topic.getTopicOfPlanningTechnicalDepartment(RoleName.PLANNING_TECHNICAL_DEPARTMENT_HEAD, "")),
      "Dự toán mới được tạo",
      null
    );
  }

  @Override
  protected String buildMessage(@NonNull CreateEventMessage event) {
    var data = event.data;
    var response = """
      Một dự toán mới vừa được tạo bởi nhân viên %s
      Mã đơn: %s
      Số đơn: %s
      Tên khách hàng: %s
      """.formatted(
      data.surveyStaffName(), data.formCode(), data.formNumber(), data.customerName());
    log.info(response);
    return response;
  }
}
