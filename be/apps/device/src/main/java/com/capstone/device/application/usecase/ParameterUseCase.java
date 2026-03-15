package com.capstone.device.application.usecase;

import com.capstone.common.annotation.AppLog;
import com.capstone.device.application.business.parameter.ParameterService;
import com.capstone.device.application.dto.request.UpdateParameterRequest;
import com.capstone.device.application.dto.response.ParameterResponse;
import com.capstone.device.application.event.producer.MessageProducer;
import com.capstone.device.application.event.producer.parameter.ParameterUpdateEvent;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
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
public class ParameterUseCase {
  final ParameterService parameterService;
  final MessageProducer messageProducer;

  @NonFinal
  Logger log;

  @Value("${rabbit-mq-config.queue}.${rabbit-mq-config.entities[4]}.${rabbit-mq-config.actions[0]}")
  String UPDATE_ROUTING_KEY;

  public Page<ParameterResponse> getParametersList(Pageable pageable, String filter) {
    return parameterService.getParameters(pageable, filter);
  }

  @Transactional(rollbackFor = Exception.class)
  public ParameterResponse updateParameter(String id, UpdateParameterRequest request) {
    log.info("UseCase: Updating parameter with id: {}", id);
    var oldData = parameterService.getParameterById(id);
    var newData = parameterService.updateParameter(id, request);

    messageProducer.send(UPDATE_ROUTING_KEY, new ParameterUpdateEvent(
      oldData.name(), oldData.value(), newData.name(), newData.value()));

    return newData;
  }
}
