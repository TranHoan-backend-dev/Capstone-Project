package com.capstone.notification.event.consumer.settlement.processing;

import com.capstone.common.enumerate.RoleName;
import com.capstone.notification.event.consumer.settlement.message.RequireSignificanceEvent;
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
public class RequireSignificanceConsumerForSettlement extends GeneralEventConsumer<RequireSignificanceEvent> {

  public RequireSignificanceConsumerForSettlement(MessageProducer producer) {
    super(producer);
  }

  @RabbitListener(queues = "${rabbit-mq-config.queue}.${rabbit-mq-config.entities[16]}.${rabbit-mq-config.actions[5]}")
  public void handle(RequireSignificanceEvent event) {
    super.handle(
      event,
      List.of(
        Topic.getTopicOfPlanningTechnicalDepartment(RoleName.SURVEY_STAFF, "/" + event.data.surveyStaff()),
        Topic.getTopicOfPlanningTechnicalDepartment(RoleName.PLANNING_TECHNICAL_DEPARTMENT_HEAD, "/" + event.data.plHead()),
        Topic.getTopic(Topic.LEADERSHIP) + "/" + event.data.companyLeadership(),
        Topic.getTopic(Topic.LEADERSHIP) + "/" + event.data.constructionPresident()
      ),
      "Ký quyết toán mới",
      null
    );
  }

  @Override
  protected String buildMessage(@NonNull RequireSignificanceEvent event) {
    var response = "Một quyết toán mới cần được ký duyệt";
    log.info(response);
    return response;
  }
}
