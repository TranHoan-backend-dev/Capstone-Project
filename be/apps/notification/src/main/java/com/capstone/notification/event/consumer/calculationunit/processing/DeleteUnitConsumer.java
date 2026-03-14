package com.capstone.notification.event.consumer.calculationunit.processing;

import com.capstone.notification.event.websocket.GeneralEventConsumer;
import com.capstone.notification.event.websocket.Topic;
import com.capstone.notification.event.consumer.calculationunit.message.DeleteUnitEventMessage;
import com.capstone.notification.event.producer.MessageProducer;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DeleteUnitConsumer extends GeneralEventConsumer<DeleteUnitEventMessage> {
    Logger log;

    public DeleteUnitConsumer(MessageProducer producer) {
        super(producer);
    }

    @RabbitListener(queues = "${rabbit-mq-config.queue}.${rabbit-mq-config.entities[8]}.${rabbit-mq-config.actions[1]}")
    public void handle(DeleteUnitEventMessage event) {
        log.info("Received delete unit event: {}", event);
        var topics = Arrays.asList(
                Topic.getTopic(Topic.PLANNING_TECHNICAL),
                Topic.getTopic(Topic.CONSTRUCTION),
                Topic.getTopic(Topic.BUSINESS));
        super.handle(event, topics, "Xóa đơn vị đo", "");
    }

    @Override
    protected String buildMessage(@NonNull DeleteUnitEventMessage event) {
        var data = event.data();
        return "Phòng IT vừa xóa đơn vị đo: '%s'".formatted(data.name());
    }
}
