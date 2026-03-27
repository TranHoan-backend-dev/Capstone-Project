package com.capstone.notification.event.consumer.settlement.processing;

import com.capstone.notification.event.consumer.estimate.message.ApproveEventMessage;
import com.capstone.notification.event.producer.MessageProducer;
import com.capstone.notification.event.consumer.GeneralEventConsumer;
import com.capstone.notification.event.consumer.Topic;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
public class FinanceConsumerForSettlement extends GeneralEventConsumer<Object> {
  public FinanceConsumerForSettlement(MessageProducer producer) {
    super(producer);
  }

  @RabbitListener(queues = "${rabbit-mq-config.queue}.${rabbit-mq-config.entities[16]}.${rabbit-mq-config.actions[3]}")
  public void handle(ApproveEventMessage event) {
    super.handle(event, List.of(Topic.getTopic(Topic.FINANCE)), "Quyết toán mới", null);
  }

  @Override
  protected String buildMessage(Object event) {
    return "Quyết toán mới cần được phòng tài vụ xử lý";
  }
}
