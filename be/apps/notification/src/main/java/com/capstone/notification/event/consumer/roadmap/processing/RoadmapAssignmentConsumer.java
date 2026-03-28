package com.capstone.notification.event.consumer.roadmap.processing;

import com.capstone.common.enumerate.RoleName;
import com.capstone.notification.event.consumer.roadmap.message.RoadmapAssignmentMessage;
import com.capstone.notification.event.producer.MessageProducer;
import com.capstone.notification.event.consumer.GeneralEventConsumer;
import com.capstone.notification.event.consumer.Topic;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
public class RoadmapAssignmentConsumer extends GeneralEventConsumer<RoadmapAssignmentMessage> {

  public RoadmapAssignmentConsumer(MessageProducer producer) {
    super(producer);
  }

  @RabbitListener(queues = "${rabbit-mq-config.queue}.${rabbit-mq-config.entities[19]}.${rabbit-mq-config.actions[4]}")
  public void handleAssign(RoadmapAssignmentMessage event) {
    var data = event.data();
    List<String> topics = List.of(Topic.getTopicOfBusinessDepartment(RoleName.METER_INSPECTION_STAFF, "/" + data.assignedStaffId()));
    super.handle(event, topics, "Phân công lộ trình ghi chỉ số", null);
  }

  @RabbitListener(queues = "${rabbit-mq-config.queue}.${rabbit-mq-config.entities[19]}.${rabbit-mq-config.actions[1]}")
  public void handleCancel(RoadmapAssignmentMessage event) {
    var data = event.data();
    List<String> topics = List.of(Topic.getTopicOfBusinessDepartment(RoleName.METER_INSPECTION_STAFF, "/" + data.oldStaffId()));
    super.handle(event, topics, "Hủy phân công lộ trình ghi chỉ số", null);
  }

  @RabbitListener(queues = "${rabbit-mq-config.queue}.${rabbit-mq-config.entities[19]}.${rabbit-mq-config.actions[0]}")
  public void handleUpdate(RoadmapAssignmentMessage event) {
    var data = event.data();
    List<String> topics = new ArrayList<>();
    if (data.oldStaffId() != null) {
      topics.add(Topic.getTopicOfBusinessDepartment(RoleName.METER_INSPECTION_STAFF, "/" + data.oldStaffId()));
    }
    if (data.assignedStaffId() != null) {
      topics.add(Topic.getTopicOfBusinessDepartment(RoleName.METER_INSPECTION_STAFF, "/" + data.assignedStaffId()));
    }
    super.handle(event, topics, "Cập nhật phân công lộ trình ghi chỉ số", null);
  }

  @Override
  protected String buildMessage(@NonNull RoadmapAssignmentMessage event) {
    var data = event.data();
    return switch (data.action()) {
      case "ASSIGN" -> "Bạn đã được phân công ghi chỉ số cho lộ trình: " + data.roadmapName();
      case "CANCEL" -> "Lộ trình ghi chỉ số " + data.roadmapName() + " đã được hủy phân công cho bạn";
      case "UPDATE" -> "Thông tin phân công lộ trình " + data.roadmapName() + " đã được cập nhật";
      default -> "Thông báo về lộ trình ghi chỉ số: " + data.roadmapName();
    };
  }
}
