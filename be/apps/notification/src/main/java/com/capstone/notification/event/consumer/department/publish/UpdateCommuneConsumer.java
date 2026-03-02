//package com.capstone.notification.event.consumer.department.publish;
//
//import com.capstone.notification.event.websocket.BaseEventConsumer;
//import com.capstone.notification.event.consumer.department.message.UpdateEventMessage;
//import org.jspecify.annotations.NonNull;
//import org.springframework.amqp.rabbit.annotation.RabbitListener;
//import org.springframework.stereotype.Component;
//
//@Component
//public class UpdateCommuneConsumer extends BaseEventConsumer<UpdateEventMessage> {
//
//  @RabbitListener(queues = "${keyword.update}_${rabbit-mq-config.entities[1]}_${keyword.queue}")
//  @Override
//  public void handle(UpdateEventMessage event) {
//    super.handle(event);
//  }
//
//  @Override
//  protected String buildMessage(@NonNull UpdateEventMessage event) {
//    var data = event.data();
//    return """
//      Phòng IT vừa cập nhật một đơn vị hành chính:
//      Cũ: %s, loại %s
//      Mới: %s, loại %s""".formatted(data.oldName(), data.oldType(), data.newName(), data.newType());
//  }
//}
