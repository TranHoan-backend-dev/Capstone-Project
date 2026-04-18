package com.capstone.notification.event.consumer.estimate.processing;

import com.capstone.notification.event.consumer.estimate.message.UpdateEventMessage;
import com.capstone.notification.event.producer.MessageProducer;
import com.capstone.notification.event.consumer.GeneralEventConsumer;
import com.capstone.notification.event.consumer.Topic;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
public class UpdateEstimateConsumer extends GeneralEventConsumer<UpdateEventMessage> {

  public UpdateEstimateConsumer(MessageProducer producer) {
    super(producer);
  }

  @RabbitListener(queues = "${rabbit-mq-config.queue}.${rabbit-mq-config.entities[14]}.${rabbit-mq-config.actions[0]}")
  public void handle(UpdateEventMessage event) {
    super.handle(
      event,
      List.of(Topic.getTopic(Topic.GENERAL)),
      "Cập nhật dự toán",
      null
    );
  }

  @Override
  protected String buildMessage(@NonNull UpdateEventMessage event) {
    var data = event.data;
    var response = """
      Một dự toán mới vừa được cập nhật bởi nhân viên %s
      Mã đơn: %s
      Số đơn: %s
      Tên khách hàng: %s
      """.formatted(
      data.surveyStaffName(), data.formCode(), data.formNumber(), data.customerName());
    log.info(response);
    return response;
  }
}
