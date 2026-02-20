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

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoadUseCase {
  final RoadService roadService;
  final MessageProducer producer;

  @Value("${rabbit-mq-config.update-road.exchange_name}")
  String UPDATE_EXCHANGE_NAME;
  @Value("${rabbit-mq-config.update-road.routing_key}")
  String UPDATE_ROUTING_KEY;

  @Value("${rabbit-mq-config.delete-road.exchange_name}")
  String DELETE_EXCHANGE_NAME;
  @Value("${rabbit-mq-config.delete-road.routing_key}")
  String DELETE_ROUTING_KEY;

  public RoadResponse createRoad(RoadRequest request) {
    return roadService.createRoad(request);
  }

  public RoadResponse updateRoad(String id, RoadRequest request) {
    var old = roadService.getRoadById(id);
    var response = roadService.updateRoad(id, request);

    producer.send(
      "UPDATE_ROAD",
      UPDATE_EXCHANGE_NAME, UPDATE_ROUTING_KEY,
      new UpdateEvent(old.name(), response.name()));
    return response;
  }

  public void deleteRoad(String id) {
    var old = roadService.getRoadById(id);
    roadService.deleteRoad(id);

    producer.send(
      "DELETE_ROAD",
      DELETE_EXCHANGE_NAME, DELETE_ROUTING_KEY, new DeleteEvent(old.name()));
  }

  public RoadResponse getRoadById(String id) {
    return roadService.getRoadById(id);
  }

  public PageResponse<RoadResponse> getAllRoads(Pageable pageable) {
    return roadService.getAllRoads(pageable);
  }
}
