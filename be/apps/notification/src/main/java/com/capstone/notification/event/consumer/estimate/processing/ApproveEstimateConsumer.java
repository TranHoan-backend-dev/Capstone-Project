package com.capstone.notification.event.consumer.estimate.processing;

import com.capstone.common.enumerate.RoleName;
import com.capstone.notification.event.consumer.estimate.message.ApproveEventMessage;
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
public class ApproveEstimateConsumer extends GeneralEventConsumer<ApproveEventMessage> {

  public ApproveEstimateConsumer(MessageProducer producer) {
    super(producer);
  }

  @RabbitListener(queues = "${rabbit-mq-config.queue}.${rabbit-mq-config.entities[14]}.${rabbit-mq-config.actions[3]}")
  public void handle(ApproveEventMessage event) {
    super.handle(
      event,
      List.of(Topic.getTopicOfPlanningTechnicalDepartment(RoleName.SURVEY_STAFF, "/" + event.data.employeeId())),
      "Dự toán mới được trưởng phòng kiểm tra",
      null
    );
  }

  @Override
  protected String buildMessage(@NonNull ApproveEventMessage event) {
    var data = event.data;
    var response = """
      Một dự toán mới vừa được tạo bởi nhân viên %s đã %s
      Mã đơn: %s
      Số đơn: %s
      Tên khách hàng: %s
      """.formatted(
      data.surveyStaffName(), data.status() ? "được trưởng phòng duyệt" : "bị trưởng phòng từ chối",
      data.formCode(), data.formNumber(), data.customerName());
    log.info(response);
    return response;
  }
}
