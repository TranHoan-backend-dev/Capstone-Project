package com.capstone.notification.event.consumer.waterprices.publish;//package com.capstone.notification.event.consumer.materialprices.publish;
//
//import com.capstone.notification.event.consumer.BaseEventConsumer;
//import com.capstone.notification.event.consumer.materialprices.message.UpdateEventMessage;
//import org.jspecify.annotations.NonNull;
//import org.springframework.amqp.rabbit.annotation.RabbitListener;
//import org.springframework.stereotype.Component;
//
//@Component
//public class UpdateMaterialPricesConsumer extends BaseEventConsumer<UpdateEventMessage> {
//
//  @RabbitListener(queues = "${keyword.update}_${rabbit-mq-config.entities[5]}_${keyword.queue}")
//  @Override
//  public void handle(UpdateEventMessage event) {
//    super.handle(event);
//  }
//
//  @Override
//  protected String buildMessage(@NonNull UpdateEventMessage event) {
//    var data = event.data();
//    return """
//      Phòng IT vừa cập nhật một nhánh tổng:
//      Cũ: %s thuộc chi nhánh %s
//      Mới: %s thuộc chi nhánh %s""".formatted(data.oldName(), data.oldNetwork(), data.newName(),
//      data.newNetwork());
//  }
//}
