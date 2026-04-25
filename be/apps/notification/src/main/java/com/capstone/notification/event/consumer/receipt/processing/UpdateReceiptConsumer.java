package com.capstone.notification.event.consumer.receipt.processing;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.enumerate.RoleName;
import com.capstone.notification.event.consumer.receipt.message.UpdateEventMessage;
import com.capstone.notification.event.producer.MessageProducer;
import com.capstone.notification.event.consumer.GeneralEventConsumer;
import com.capstone.notification.event.consumer.Topic;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.List;

@AppLog
@Component
public class UpdateReceiptConsumer extends GeneralEventConsumer<UpdateEventMessage> {
  private Logger log;

  public UpdateReceiptConsumer(MessageProducer producer) {
    super(producer);
  }

  @RabbitListener(queues = "${rabbit-mq-config.queue}.${rabbit-mq-config.entities[15]}.${rabbit-mq-config.actions[2]}")
  public void handle(UpdateEventMessage event) {
    // Notify ORDER_RECEIVING_STAFF topic
    var topic = Topic.getTopicOfPlanningTechnicalDepartment(RoleName.ORDER_RECEIVING_STAFF, "");

    super.handle(
      event,
      List.of(topic),
      "Biên lai thu tiền mới đã được tạo",
      "/technical/receipts/" + event.data().formCode() + "/" + event.data().formNumber()
    );
  }

  @Override
  protected String buildMessage(@NonNull UpdateEventMessage event) {
    var data = event.data();
    var message = """
        Có biên lai thu tiền mới vừa được tạo!
        Thông tin biên lai:
        - Số biên lai: %s
        - Mã đơn/Số đơn: %s/%s
        - Tên khách hàng: %s
        - Ngày thanh toán: %s
      """.formatted(
        data.receiptNumber(),
        data.formCode(), data.formNumber(),
        data.customerName(),
        data.paymentDate()
    );
    log.info(message);
    return message;
  }
}
