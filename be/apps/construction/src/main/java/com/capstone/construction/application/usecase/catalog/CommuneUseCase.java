package com.capstone.construction.application.usecase.catalog;

import com.capstone.common.annotation.AppLog;
import com.capstone.construction.application.business.commune.CommuneService;
import com.capstone.construction.application.dto.request.catalog.CommuneRequest;
import com.capstone.construction.application.dto.response.catalog.CommuneResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.application.event.producer.MessageProducer;
import com.capstone.construction.application.event.producer.commune.DeleteEvent;
import com.capstone.construction.application.event.producer.commune.UpdateEvent;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@AppLog
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommuneUseCase {
  final CommuneService communeService;
  final MessageProducer producer;

  @Value("${rabbit-mq-config.update-commune.exchange_name}")
  String UPDATE_EXCHANGE_NAME;
  @Value("${rabbit-mq-config.update-commune.routing_key}")
  String UPDATE_ROUTING_KEY;

  @Value("${rabbit-mq-config.delete-commune.exchange_name}")
  String DELETE_EXCHANGE_NAME;
  @Value("${rabbit-mq-config.delete-commune.routing_key}")
  String DELETE_ROUTING_KEY;

  public void createCommune(@NonNull CommuneRequest request) {
    communeService.createCommune(request);
  }

  public CommuneResponse updateCommune(String id, CommuneRequest request) {
    var old = communeService.getCommuneById(id);
    var response = communeService.updateCommune(id, request);

    if (!request.name().isBlank() && !request.type().isBlank()) {
      producer.send("UPDATE_COMMUNE", UPDATE_EXCHANGE_NAME, UPDATE_ROUTING_KEY,
        new UpdateEvent(
          old.name(), old.type(),
          response.name(), response.type()
        )
      );
    }
    return response;
  }

  public void deleteCommune(String id) {
    var old = communeService.getCommuneById(id);
    communeService.deleteCommune(id);

    producer.send("DELETE_COMMUNE", DELETE_EXCHANGE_NAME, DELETE_ROUTING_KEY,
      new DeleteEvent(old.name(), old.type()));
  }

  public CommuneResponse getCommuneById(String id) {
    return communeService.getCommuneById(id);
  }

  public PageResponse<CommuneResponse> getAllCommunes(Pageable pageable) {
    return communeService.getAllCommunes(pageable);
  }
}
