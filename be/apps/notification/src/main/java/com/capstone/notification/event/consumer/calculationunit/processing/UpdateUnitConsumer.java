package com.capstone.notification.event.consumer.calculationunit.processing;

import com.capstone.notification.event.websocket.GeneralEventConsumer;
import com.capstone.notification.event.websocket.Topic;
import com.capstone.notification.event.consumer.calculationunit.message.UpdateUnitEventMessage;
import com.capstone.notification.event.producer.MessageProducer;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class UpdateUnitConsumer extends GeneralEventConsumer<UpdateUnitEventMessage> {
    Logger log;

    public UpdateUnitConsumer(MessageProducer producer) {
        super(producer);
    }

    @RabbitListener(queues = "${rabbit-mq-config.queue}.${rabbit-mq-config.entities[8]}.${rabbit-mq-config.actions[0]}")
    public void handle(UpdateUnitEventMessage event) {
        log.info("Received update unit event: {}", event);
        var topics = Arrays.asList(
                Topic.getTopic(Topic.PLANNING_TECHNICAL),
                Topic.getTopic(Topic.CONSTRUCTION),
                Topic.getTopic(Topic.BUSINESS));
        super.handle(event, topics, "Cập nhật đơn vị đo", "");
    }

    @Override
    protected String buildMessage(@NonNull UpdateUnitEventMessage event) {
        var data = event.data();
        return "Phòng IT vừa cập nhật đơn vị đo từ '%s' thành '%s'".formatted(data.oldName(), data.newName());
    }
}
