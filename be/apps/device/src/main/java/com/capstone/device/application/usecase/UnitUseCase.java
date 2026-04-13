package com.capstone.device.application.usecase;

import com.capstone.common.annotation.AppLog;
import com.capstone.device.application.business.unit.UnitService;
import com.capstone.device.application.dto.request.unit.CreateUnitRequest;
import com.capstone.device.application.dto.request.unit.UpdateUnitRequest;
import com.capstone.device.application.dto.response.UnitResponse;
import com.capstone.device.application.event.producer.MessageProducer;
import com.capstone.device.application.event.producer.unit.UnitDeleteEvent;
import com.capstone.device.application.event.producer.unit.UnitUpdateEvent;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@AppLog
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UnitUseCase {
  final UnitService unitService;
  final MessageProducer messageProducer;

  @NonFinal
  Logger log;

  @Value("${rabbit-mq-config.queue}.${rabbit-mq-config.entities[3]}.${rabbit-mq-config.actions[0]}")
  String UPDATE_ROUTING_KEY;

  @Value("${rabbit-mq-config.queue}.${rabbit-mq-config.entities[3]}.${rabbit-mq-config.actions[1]}")
  String DELETE_ROUTING_KEY;

  public Page<UnitResponse> getUnits(Pageable pageable, String filter) {
    log.info("Get units using filter: {}", filter);
    return unitService.getPaginatedUnits(pageable, filter);
  }

  public UnitResponse createUnit(@NonNull CreateUnitRequest request) {
    log.info("UseCase: Creating unit: {}", request.name());
    return unitService.createUnit(request);
  }

  @Transactional(rollbackFor = Exception.class)
  public UnitResponse updateUnit(String id, UpdateUnitRequest request) {
    log.info("UseCase: Updating unit with id: {}", id);
    var oldData = unitService.getUnitById(id);
    var newData = unitService.updateUnit(id, request);

    messageProducer.send(UPDATE_ROUTING_KEY, new UnitUpdateEvent(oldData.name(), newData.name()));
    return newData;
  }

  @Transactional(rollbackFor = Exception.class)
  public void deleteUnit(String id) {
    log.info("UseCase: Deleting unit with id: {}", id);
    var oldData = unitService.getUnitById(id);
    unitService.deleteUnit(id);

    messageProducer.send(DELETE_ROUTING_KEY, new UnitDeleteEvent(oldData.name()));
  }
}
