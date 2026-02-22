package com.capstone.device.application.usecase;

import com.capstone.device.application.business.metertype.MeterTypeService;
import com.capstone.device.application.dto.request.metertype.CreateRequest;
import com.capstone.device.application.dto.request.metertype.UpdateRequest;
import com.capstone.device.application.dto.response.PageResponse;
import com.capstone.device.application.dto.response.WaterMeterTypeResponse;
import com.capstone.device.application.event.producer.MessageProducer;
import com.capstone.device.application.event.producer.metertype.DeleteEvent;
import com.capstone.device.application.event.producer.metertype.UpdateEvent;
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
public class MeterTypeUseCase {
  final MeterTypeService meterTypeService;
  final MessageProducer producer;
  final String prefix = ".meter-type.";

  @Value("${rabbit-mq-config.queue}" + prefix + "${rabbit-mq-config.actions[0]}")
  String UPDATE_ROUTING_KEY;

  @Value("${rabbit-mq-config.queue}" + prefix + "${rabbit-mq-config.actions[1]}")
  String DELETE_ROUTING_KEY;

  public WaterMeterTypeResponse createMeterType(@NonNull CreateRequest request) {
    return meterTypeService.createMeterType(request);
  }

  @Transactional(rollbackFor = Exception.class)
  public WaterMeterTypeResponse updateMeterType(String id, @NonNull UpdateRequest request) {
    var old = meterTypeService.getMeterTypeById(id);
    var n = meterTypeService.updateMeterType(id, request);

    producer.send(UPDATE_ROUTING_KEY, new UpdateEvent(
      old.name(), old.origin(), old.meterModel(), old.size(), old.maxIndex(),
      old.qn(), old.qt(), old.qmin(), old.diameter(),
      n.name(), n.origin(), n.meterModel(), n.size(), n.maxIndex(),
      n.qn(), n.qt(), n.qmin(), n.diameter()));
    return n;
  }

  @Transactional(rollbackFor = Exception.class)
  public void deleteMeterType(String id) {
    var old = meterTypeService.getMeterTypeById(id);
    meterTypeService.deleteMeterType(id);

    producer.send(DELETE_ROUTING_KEY, new DeleteEvent(
      old.name(), old.origin(), old.meterModel(), old.size(), old.maxIndex(),
      old.qn(), old.qt(), old.qmin(), old.diameter()));
  }

  public WaterMeterTypeResponse getMeterTypeById(String id) {
    return meterTypeService.getMeterTypeById(id);
  }

  public PageResponse<WaterMeterTypeResponse> getAllMeterTypes(Pageable pageable) {
    return meterTypeService.getAllMeterTypes(pageable);
  }
}
