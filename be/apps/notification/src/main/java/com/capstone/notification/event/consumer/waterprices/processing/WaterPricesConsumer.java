package com.capstone.notification.event.consumer.waterprices.processing;

import com.capstone.common.enumerate.RoleName;
import com.capstone.notification.event.consumer.GeneralEventConsumer;
import com.capstone.notification.event.consumer.Topic;
import com.capstone.notification.event.consumer.waterprices.message.WaterPricesEventMessage;
import com.capstone.notification.event.producer.MessageProducer;
import org.jspecify.annotations.NonNull;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class WaterPricesConsumer extends GeneralEventConsumer<WaterPricesEventMessage> {

  public WaterPricesConsumer(MessageProducer producer) {
    super(producer);
  }

  @RabbitListener(queues = "${rabbit-mq-config.queue}.${rabbit-mq-config.entities[10]}.${rabbit-mq-config.update}")
  public void handleUpdate(@NonNull WaterPricesEventMessage event) {
    super.handle(
      event,
      List.of(
        Topic.getTopicOfPlanningTechnicalDepartment(RoleName.SURVEY_STAFF, ""),
        Topic.getTopic(Topic.CONSTRUCTION),
        Topic.getTopic(Topic.BUSINESS)),
      "Cập nhật giá nước", null);
  }

  @RabbitListener(queues = "${rabbit-mq-config.queue}.${rabbit-mq-config.entities[10]}.${rabbit-mq-config.delete}")
  public void handleDelete(@NonNull WaterPricesEventMessage event) {
    super.handle(
      event,
      List.of(
        Topic.getTopicOfPlanningTechnicalDepartment(RoleName.SURVEY_STAFF, ""),
        Topic.getTopic(Topic.CONSTRUCTION),
        Topic.getTopic(Topic.BUSINESS)),
      "Giá nước mới được cập nhật", null);
  }

  @Override
  protected String buildMessage(@NonNull WaterPricesEventMessage event) {
    var data = event.data();
    return switch (data.action()) {
      case "UPDATE" -> """
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
        data.newUserTarget(), data.newTax(), data.newEnvironmentPrice(), data.newApplicationPeriod(), data.newDescription());
      case "DELETE" -> """
        Phòng IT vừa xóa một giá nước
        ---------------------------------------
        Giá nước bị xóa:
        - Mục đích sử dụng: %s
        - Thuế: %s
        - Phí bảo vệ môi trường: %s
        - Kỳ áp dụng: %s
        - Mô tả: %s
        """.formatted(
        data.oldUserTarget(), data.oldTax(), data.oldEnvironmentPrice(), data.oldApplicationPeriod(), data.oldDescription());
      default -> "Thông báo về giá nước";
    };
  }
}
