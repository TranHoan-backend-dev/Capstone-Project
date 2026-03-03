package com.capstone.construction.application.usecase.catalog;

import com.capstone.common.annotation.AppLog;
import com.capstone.construction.application.business.commune.CommuneService;
import com.capstone.construction.application.dto.request.catalog.CommuneRequest;
import com.capstone.construction.application.dto.response.catalog.CommuneResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.application.event.producer.MessageProducer;
import com.capstone.construction.application.event.producer.commune.DeleteEvent;
import com.capstone.construction.application.event.producer.commune.UpdateEvent;
import com.capstone.construction.domain.enumerate.CommuneType;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@AppLog
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommuneUseCase {
  final CommuneService communeService;
  final MessageProducer producer;
  final String prefix = ".commune.";

  @Value("${rabbit-mq-config.queue_name}" + prefix + "${rabbit-mq-config.actions[0]}")
  String UPDATE_ROUTING_KEY;

  @Value("${rabbit-mq-config.queue_name}" + prefix + "${rabbit-mq-config.actions[1]}")
  String DELETE_ROUTING_KEY;

  public void createCommune(@NonNull CommuneRequest request) {
    communeService.createCommune(request);
  }

  @Transactional(rollbackFor = Exception.class)
  public CommuneResponse updateCommune(String id, CommuneRequest request) {
    var old = communeService.getCommuneById(id);
    var response = communeService.updateCommune(id, request);

    if (!request.name().isBlank() && !request.type().isBlank()) {
      var newCommuneType = CommuneType.valueOf(request.type()).equals(CommuneType.URBAN_WARD) ? "Phường" : "Xã";
      var oldCommuneType = CommuneType.valueOf(old.type()).equals(CommuneType.URBAN_WARD) ? "Phường" : "Xã";
      producer.send(UPDATE_ROUTING_KEY,
          new UpdateEvent(old.name(), response.name(), oldCommuneType, newCommuneType));
    }
    return response;
  }

  @Transactional(rollbackFor = Exception.class)
  public void deleteCommune(String id) {
    var old = communeService.getCommuneById(id);
    communeService.deleteCommune(id);

    producer.send(DELETE_ROUTING_KEY, new DeleteEvent(old.name(), old.type()));
  }

  public CommuneResponse getCommuneById(String id) {
    return communeService.getCommuneById(id);
  }

  public PageResponse<CommuneResponse> getAllCommunes(Pageable pageable, String search, String type) {
    return communeService.getAllCommunes(pageable, search, type);
  }
}
