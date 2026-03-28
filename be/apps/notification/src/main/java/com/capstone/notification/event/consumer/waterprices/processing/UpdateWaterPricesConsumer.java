package com.capstone.notification.event.consumer.waterprices.processing;

import com.capstone.common.enumerate.RoleName;
import com.capstone.notification.event.consumer.waterprices.message.UpdateEventMessage;
import com.capstone.notification.event.producer.MessageProducer;
import com.capstone.notification.event.consumer.GeneralEventConsumer;
import com.capstone.notification.event.consumer.Topic;
import org.jspecify.annotations.NonNull;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UpdateWaterPricesConsumer extends GeneralEventConsumer<UpdateEventMessage> {

  public UpdateWaterPricesConsumer(MessageProducer producer) {
    super(producer);
  }

  @RabbitListener(queues = "${rabbit-mq-config.queue}.${rabbit-mq-config.entities[10]}.${rabbit-mq-config.update}")
  public void handle(UpdateEventMessage event) {
    super.handle(
      event,
      List.of(
        Topic.getTopicOfPlanningTechnicalDepartment(RoleName.SURVEY_STAFF, ""),
        Topic.getTopic(Topic.CONSTRUCTION),
        Topic.getTopic(Topic.BUSINESS)),
      "", null);
  }

  @Override
  protected String buildMessage(@NonNull UpdateEventMessage event) {
    var data = event.data();
    return """
      Phòng IT vừa cập nhật giá nước mới
      ---------------------------------------
      Giá nước cũ:
      - Mục đích sử dụng: %s
      - Thuế: %s
      - Phí bảo vệ môi trường: %s
      - Kỳ áp dụng: %s
      - Mô tả: %s
      ---------------------------------------
      Giá nước mới:
      - Mục đích sử dụng: %s
      - Thuế: %s
      - Phí bảo vệ môi trường: %s
      - Kỳ áp dụng: %s
      - Mô tả: %s
      """.formatted(
      data.oldUserTarget(), data.oldTax(), data.oldEnvironmentPrice(), data.oldApplicationPeriod(), data.oldDescription(),
      data.newUserTarget(), data.newTax(), data.newEnvironmentPrice(), data.newApplicationPeriod(), data.newDescription()
    );
  }
}
