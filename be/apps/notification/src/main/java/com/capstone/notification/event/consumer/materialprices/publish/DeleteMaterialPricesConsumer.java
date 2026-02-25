package com.capstone.notification.event.consumer.materialprices.publish;

import com.capstone.notification.event.consumer.materialprices.message.DeleteEventMessage;
import com.capstone.notification.event.websocket.GeneralEventConsumer;
import com.capstone.notification.event.websocket.Topic;

import java.util.List;

import org.jspecify.annotations.NonNull;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class DeleteMaterialPricesConsumer extends GeneralEventConsumer<DeleteEventMessage> {

  @RabbitListener(queues = "${keyword.delete}_${rabbit-mq-config.entities[5]}_${keyword.queue}")
  @Override
  public void handle(DeleteEventMessage event, @NonNull List<String> topics, String title) {
    super.handle(event, List.of(
      Topic.getTopic(Topic.PLANNING_TECHNICAL),
      Topic.getTopic(Topic.CONSTRUCTION)), "Xóa đơn giá vật tư");
  }

  @Override
  protected String buildMessage(@NonNull DeleteEventMessage event) {
    var data = event.data();
    return """
      Phòng IT vừa xóa một đơn giá vật tư.
      Thông tin chi tiết đơn giá vật tư mới được xóa:
      - Tên đơn giá vật tư: %s
      - Giá: %s
      - Giá nhân công: %s
      - Giá nhân công tuyến xã: %s
      - Giá máy thi công: %s
      - Giá máy thi công tuyến xã: %s
      - Nhóm: %s
      - Đơn vị tính: %s
      """.formatted(
      data.jobContent(), data.price(), data.laborPrice(),
      data.laborPriceAtRuralCommune(), data.constructionMachineryPrice(),
      data.constructionMachineryPriceAtRuralCommune(), data.groupName(),
      data.unitName());
  }
}
