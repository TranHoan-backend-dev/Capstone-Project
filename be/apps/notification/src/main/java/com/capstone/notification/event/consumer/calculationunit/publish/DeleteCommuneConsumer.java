//package com.capstone.notification.event.consumer.calculationunit.publish;
//
//import com.capstone.notification.event.consumer.BaseEventConsumer;
//import com.capstone.notification.event.consumer.calculationunit.message.DeleteEventMessage;
//import org.jspecify.annotations.NonNull;
//import org.springframework.amqp.rabbit.annotation.RabbitListener;
//import org.springframework.stereotype.Component;
//
//@Component
//public class DeleteCommuneConsumer extends BaseEventConsumer<DeleteEventMessage> {
//
//  @RabbitListener(queues = "${keyword.delete}_${rabbit-mq-config.entities[1]}_${keyword.queue}")
//  @Override
//  public void handle(DeleteEventMessage event) {
//    super.handle(event);
//  }
//
//  @Override
//  protected String buildMessage(@NonNull DeleteEventMessage event) {
//    var data = event.data();
//    return "Phòng IT vừa xóa đơn vị hành chính %s, loại %s".formatted(data.name(), data.type());
//  }
//}
