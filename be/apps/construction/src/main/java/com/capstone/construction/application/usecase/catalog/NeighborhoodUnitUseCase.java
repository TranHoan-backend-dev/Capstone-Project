package com.capstone.construction.application.usecase.catalog;

import com.capstone.construction.application.business.unit.NeighborhoodUnitService;
import com.capstone.construction.application.dto.request.catalog.NeighborhoodUnitRequest;
import com.capstone.construction.application.dto.response.catalog.NeighborhoodUnitResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.application.event.producer.MessageProducer;
import com.capstone.construction.application.event.producer.unit.DeleteEvent;
import com.capstone.construction.application.event.producer.unit.UpdateEvent;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NeighborhoodUnitUseCase {
  final NeighborhoodUnitService unitService;
  final MessageProducer producer;

  @Value("${rabbit-mq-config.update-unit.exchange_name}")
  String UPDATE_EXCHANGE_NAME;
  @Value("${rabbit-mq-config.update-unit.routing_key}")
  String UPDATE_ROUTING_KEY;

  @Value("${rabbit-mq-config.delete-unit.exchange_name}")
  String DELETE_EXCHANGE_NAME;
  @Value("${rabbit-mq-config.delete-unit.routing_key}")
  String DELETE_ROUTING_KEY;

  public void createUnit(@NonNull NeighborhoodUnitRequest request) {
    unitService.createUnit(request);
  }

  public NeighborhoodUnitResponse updateUnit(String id, NeighborhoodUnitRequest request) {
    var old = unitService.getUnitById(id);
    var response = unitService.updateUnit(id, request);

    producer.send(
      "UPDATE_UNIT",
      UPDATE_EXCHANGE_NAME, UPDATE_ROUTING_KEY,
      new UpdateEvent(
        old.name(), old.communeName(),
        response.name(), response.communeName()
      ));
    return response;
  }

  public void deleteUnit(String id) {
    var old = unitService.getUnitById(id);
    unitService.deleteUnit(id);

    producer.send(
      "DELETE_UNIT",
      DELETE_EXCHANGE_NAME, DELETE_ROUTING_KEY,
      new DeleteEvent(old.name(), old.communeName()));
  }

  public NeighborhoodUnitResponse getUnitById(String id) {
    return unitService.getUnitById(id);
  }

  public PageResponse<NeighborhoodUnitResponse> getAllUnits(Pageable pageable) {
    return unitService.getAllUnits(pageable);
  }
}
