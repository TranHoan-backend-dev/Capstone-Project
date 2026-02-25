package com.capstone.notification.event.consumer.materialprices.publish;

import com.capstone.notification.event.consumer.materialprices.message.UpdateEventMessage;
import com.capstone.notification.event.websocket.GeneralEventConsumer;
import com.capstone.notification.event.websocket.Topic;
import org.jspecify.annotations.NonNull;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UpdateMaterialPricesConsumer extends GeneralEventConsumer<UpdateEventMessage> {

  @RabbitListener(queues = "${keyword.update}_${rabbit-mq-config.entities[5]}_${keyword.queue}")
  @Override
  public void handle(UpdateEventMessage event, @NonNull List<String> topics, String title) {
    super.handle(event, List.of(
      Topic.getTopic(Topic.PLANNING_TECHNICAL),
      Topic.getTopic(Topic.CONSTRUCTION)), "Cập nhật đơn giá vật tư");
  }

  @Override
  protected String buildMessage(@NonNull UpdateEventMessage event) {
    var data = event.data();
    return """
      Phòng IT vừa cập nhật đơn giá vật tư:

      | Tiêu chí | Thông tin cũ | Thông tin mới |
      | :---- | :---- | :---- |
      | Tên công việc | %s | %s |
      | Đơn giá | %s | %s |
      | ĐG Nhân công | %s | %s |
      | ĐG Nhân công tuyến xã | %s | %s |
      | ĐG Máy thi công | %s | %s |
      | ĐG Máy thi công tuyến xã | %s | %s |
      | Nhóm | %s | %s |
      | Đơn vị tính | %s | %s |
      """
      .formatted(
        data.oldJobContent(), data.newJobContent(),
        data.oldPrice(), data.newPrice(),
        data.oldLaborPrice(), data.newLaborPrice(),
        data.oldLaborPriceAtRuralCommune(), data.newLaborPriceAtRuralCommune(),
        data.oldConstructionMachineryPrice(), data.newConstructionMachineryPrice(),
        data.oldConstructionMachineryPriceAtRuralCommune(), data.newConstructionMachineryPriceAtRuralCommune(),
        data.oldGroupName(), data.newGroupName(),
        data.oldUnitName(), data.newUnitName());
  }
}
