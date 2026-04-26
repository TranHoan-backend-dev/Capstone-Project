package com.capstone.construction.application.usecase.catalog;

import com.capstone.construction.application.business.roadmap.RoadmapService;
import com.capstone.construction.application.dto.request.catalog.RoadmapRequest;
import com.capstone.construction.application.dto.response.catalog.RoadmapResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.application.event.producer.MessageProducer;
import com.capstone.construction.application.event.producer.roadmap.RoadmapAssignmentEvent;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoadmapUseCase {
  RoadmapService roadmapService;
  MessageProducer messageProducer;

  @Value("${rabbit-mq-config.queue_name}")
  @NonFinal
  String QUEUE_NAME;

  @Value(".${rabbit-mq-config.entities[10]}.")
  @NonFinal
  String ROADMAP_PREFIX;

  @Value("${rabbit-mq-config.actions[4]}")
  @NonFinal
  String ASSIGN_ACTION;

  @Value("${rabbit-mq-config.actions[1]}")
  @NonFinal
  String DELETE_ACTION;

  @Value("${rabbit-mq-config.actions[0]}")
  @NonFinal
  String UPDATE_ACTION;

  public RoadmapResponse createRoadmap(@NonNull RoadmapRequest request) {
    return roadmapService.createRoadmap(request);
  }

  public RoadmapResponse updateRoadmap(String id, RoadmapRequest request) {
    return roadmapService.updateRoadmap(id, request);
  }

  public void deleteRoadmap(String id) {
    roadmapService.deleteRoadmap(id);
  }

  public RoadmapResponse getRoadmapById(String id) {
    return roadmapService.getRoadmapById(id);
  }

  public PageResponse<RoadmapResponse> getAllRoadmaps(Pageable pageable, String keyword, String lateralId, String networkId) {
    return roadmapService.getAllRoadmaps(pageable, keyword, lateralId, networkId);
  }

  @Transactional(rollbackFor = Exception.class)
  public RoadmapResponse assignStaff(String id, String staffId) {
    var saved = roadmapService.assignStaff(id, staffId);
    var event = RoadmapAssignmentEvent.builder()
      .roadmapId(id)
      .roadmapName(saved.name())
      .assignedStaffId(staffId)
      .action("ASSIGN")
      .build();
    messageProducer.send(QUEUE_NAME + ROADMAP_PREFIX + ASSIGN_ACTION, event);
    return saved;
  }

  @Transactional(rollbackFor = Exception.class)
  public RoadmapResponse cancelAssignment(String id) {
    var oldResponse = roadmapService.getRoadmapById(id);
    var oldStaffId = oldResponse.assignedStaffId();

    var saved = roadmapService.cancelAssignment(id);
    var event = RoadmapAssignmentEvent.builder()
      .roadmapId(id)
      .roadmapName(saved.name())
      .assignedStaffId(null)
      .oldStaffId(oldStaffId)
      .action("CANCEL")
      .build();
    messageProducer.send(QUEUE_NAME + ROADMAP_PREFIX + DELETE_ACTION, event);
    return saved;
  }

  @Transactional(rollbackFor = Exception.class)
  public RoadmapResponse updateAssignment(String id, String staffId) {
    var oldResponse = roadmapService.getRoadmapById(id);
    var oldStaffId = oldResponse.assignedStaffId();

    var saved = roadmapService.updateAssignment(id, staffId);
    var event = RoadmapAssignmentEvent.builder()
      .roadmapId(id)
      .roadmapName(saved.name())
      .assignedStaffId(staffId)
      .oldStaffId(oldStaffId)
      .action("UPDATE")
      .build();
    messageProducer.send(QUEUE_NAME + ROADMAP_PREFIX + UPDATE_ACTION, event);
    return saved;
  }
}
