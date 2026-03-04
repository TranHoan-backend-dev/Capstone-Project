package com.capstone.notification.event.consumer.materialprices.processing;

import com.capstone.common.annotation.AppLog;
import com.capstone.notification.event.consumer.materialprices.message.UpdateEventMessage;
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
public class UpdateMaterialPricesConsumer extends GeneralEventConsumer<UpdateEventMessage> {
  Logger log;

  public UpdateMaterialPricesConsumer(MessageProducer producer) {
    super(producer);
  }

  @RabbitListener(queues = "${rabbit-mq-config.queue}.material-price.update")
  public void handle(UpdateEventMessage event) {
    super.handle(event, List.of(
        Topic.getTopic(Topic.PLANNING_TECHNICAL),
        Topic.getTopic(Topic.CONSTRUCTION)),
      "Cập nhật đơn giá vật tư", null);
  }

  @Override
  protected String buildMessage(@NonNull UpdateEventMessage event) {
    var data = event.data();
    var message = """
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
    log.info(message);
    return message;
  }
}
