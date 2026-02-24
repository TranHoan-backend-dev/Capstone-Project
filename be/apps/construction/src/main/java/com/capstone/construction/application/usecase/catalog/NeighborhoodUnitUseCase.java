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
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NeighborhoodUnitUseCase {
  final NeighborhoodUnitService unitService;
  final MessageProducer producer;
  final String prefix = ".neighborhood-unit.";

  @Value("${rabbit-mq-config.queue_name}" + prefix + "${rabbit-mq-config.update}")
  String UPDATE_ROUTING_KEY; // chu ky gan vao tin nhan khi gui den Exchange

  @Value("${rabbit-mq-config.queue_name}" + prefix + "${rabbit-mq-config.delete}")
  String DELETE_ROUTING_KEY;

  public void createUnit(@NonNull NeighborhoodUnitRequest request) {
    unitService.createUnit(request);
  }

  @Transactional(rollbackFor = Exception.class)
  public NeighborhoodUnitResponse updateUnit(String id, NeighborhoodUnitRequest request) {
    var old = unitService.getUnitById(id);
    var response = unitService.updateUnit(id, request);

    producer.send(UPDATE_ROUTING_KEY,
      new UpdateEvent(
        old.name(), old.communeName(),
        response.name(), response.communeName()
      ));
    return response;
  }

  @Transactional(rollbackFor = Exception.class)
  public void deleteUnit(String id) {
    var old = unitService.getUnitById(id);
    unitService.deleteUnit(id);

    producer.send(DELETE_ROUTING_KEY, new DeleteEvent(old.name(), old.communeName()));
  }

  public NeighborhoodUnitResponse getUnitById(String id) {
    return unitService.getUnitById(id);
  }

  public PageResponse<NeighborhoodUnitResponse> getAllUnits(Pageable pageable) {
    return unitService.getAllUnits(pageable);
  }
}
