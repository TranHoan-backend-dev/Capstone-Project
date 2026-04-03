//package com.capstone.notification.event.consumer.waterprices.processing;
//
//import com.capstone.common.enumerate.RoleName;
//import com.capstone.notification.event.consumer.waterprices.message.DeleteEventMessage;
//import com.capstone.notification.event.producer.MessageProducer;
//import com.capstone.notification.event.consumer.GeneralEventConsumer;
//import com.capstone.notification.event.consumer.Topic;
//import org.jspecify.annotations.NonNull;
//import org.springframework.amqp.rabbit.annotation.RabbitListener;
//import org.springframework.stereotype.Component;
//
//import java.util.List;
//
//@Component
//public class DeleteWaterPricesConsumer extends GeneralEventConsumer<DeleteEventMessage> {
//
//  public DeleteWaterPricesConsumer(MessageProducer producer) {
//    super(producer);
//  }
//
//  @RabbitListener(queues = "${rabbit-mq-config.queue}.${rabbit-mq-config.entities[10]}.${rabbit-mq-config.delete}")
//  public void handle(DeleteEventMessage event) {
//    super.handle(
//        event,
//        List.of(
//            Topic.getTopicOfPlanningTechnicalDepartment(RoleName.SURVEY_STAFF, ""),
//            Topic.getTopic(Topic.CONSTRUCTION),
//            Topic.getTopic(Topic.BUSINESS)),
//        "Giá nước mới được cập nhật", null);
//  }
//
//  @Override
//  protected String buildMessage(@NonNull DeleteEventMessage event) {
//    var data = event.data();
//    return """
//        Phòng IT vừa xóa một giá nước
//        ---------------------------------------
//        Giá nước bị xóa:
//        - Mục đích sử dụng: %s
//        - Thuế: %s
//        - Phí bảo vệ môi trường: %s
//        - Kỳ áp dụng: %s
//        - Mô tả: %s
//        """.formatted(data.userTarget(), data.tax(), data.environmentPrice(), data.applicationPeriod(), data.expirationDate());
//  }
//}
