package com.capstone.notification.event.consumer.order.processing;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.enumerate.RoleName;
import com.capstone.notification.event.consumer.order.message.CreateEventMessage;
import com.capstone.notification.event.producer.MessageProducer;
import com.capstone.notification.event.websocket.GeneralEventConsumer;
import com.capstone.notification.event.websocket.Topic;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@AppLog
@Component
public class CreateOrderConsumer extends GeneralEventConsumer<CreateEventMessage> {
  private Logger log;

  private final SimpMessagingTemplate messagingTemplate;

  public CreateOrderConsumer(SimpMessagingTemplate template, MessageProducer producer) {
    super(producer);
    this.messagingTemplate = template;
  }

  @RabbitListener(queues = "${rabbit-mq-config.queue}.${rabbit-mq-config.entities[13]}.${rabbit-mq-config.actions[2]}")
  public void handle(CreateEventMessage event) {
    super.handle(
      event,
      List.of(Topic.getTopicOfPlanningTechnicalDepartment(RoleName.PLANNING_TECHNICAL_DEPARTMENT_HEAD)),
      "Đơn chờ lắp đặt mới vừa được tạo",
      null);

    // gửi riêng sự kiện này để fetch danh sách đơn chờ trong trang của trưởng phòng
    final var topic = "/create-new-order";
    messagingTemplate.convertAndSend(topic, event);
  }

  @Override
  protected String buildMessage(@NonNull CreateEventMessage event) {
    var data = event.data();
    var response = """
        Đơn lắp đặt mới vừa được tạo!
        Thông tin đơn:
        - Mã đơn: %s
        - Số đơn: %s
        - Tên khách hàng: %s
        - Nhân viên tiếp nhận: %s
        - Tạo lúc: %s
      """.formatted(data.formCode(), data.formNumber(),
      data.customerName(), data.creator(), data.createdAt());
    log.info(response);

    return response;
  }
}
