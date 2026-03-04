package com.capstone.construction.application.usecase.catalog;

import com.capstone.construction.application.business.road.RoadService;
import com.capstone.construction.application.dto.request.catalog.RoadRequest;
import com.capstone.construction.application.dto.response.catalog.RoadResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.application.event.producer.MessageProducer;
import com.capstone.construction.application.event.producer.road.DeleteEvent;
import com.capstone.construction.application.event.producer.road.UpdateEvent;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoadUseCase {
  final RoadService roadService;
  final MessageProducer producer;
  final String prefix = ".road.";

  @Value("${rabbit-mq-config.queue_name}" + prefix + "${rabbit-mq-config.update}")
  String UPDATE_ROUTING_KEY; // chu ky gan vao tin nhan khi gui den Exchange

  @Value("${rabbit-mq-config.queue_name}" + prefix + "${rabbit-mq-config.delete}")
  String DELETE_ROUTING_KEY;

  public RoadResponse createRoad(RoadRequest request) {
    return roadService.createRoad(request);
  }

  @Transactional(rollbackFor = Exception.class)
  public RoadResponse updateRoad(String id, RoadRequest request) {
    var old = roadService.getRoadById(id);
    var response = roadService.updateRoad(id, request);

    if (!request.name().isBlank()) {
      producer.send(UPDATE_ROUTING_KEY, new UpdateEvent(old.name(), response.name()));
    }
    return response;
  }

  @Transactional(rollbackFor = Exception.class)
  public void deleteRoad(String id) {
    var old = roadService.getRoadById(id);
    roadService.deleteRoad(id);

    producer.send(DELETE_ROUTING_KEY, new DeleteEvent(old.name()));
  }

  public RoadResponse getRoadById(String id) {
    return roadService.getRoadById(id);
  }

  public PageResponse<RoadResponse> getAllRoads(Pageable pageable, String keyword) {
    return roadService.getAllRoads(pageable, keyword);
  }
}
