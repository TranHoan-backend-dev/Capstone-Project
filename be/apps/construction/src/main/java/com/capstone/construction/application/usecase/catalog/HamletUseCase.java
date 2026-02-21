package com.capstone.construction.application.usecase.catalog;

import com.capstone.construction.application.business.hamlet.HamletService;
import com.capstone.construction.application.dto.request.hamlet.CreateHamletRequest;
import com.capstone.construction.application.dto.request.hamlet.UpdateHamletRequest;
import com.capstone.construction.application.dto.response.catalog.HamletResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.application.event.producer.MessageProducer;
import com.capstone.construction.application.event.producer.hamlet.DeleteHamletEvent;
import com.capstone.construction.application.event.producer.hamlet.UpdateHamletEvent;
import com.capstone.construction.domain.enumerate.HamletType;
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
public class HamletUseCase {
  final HamletService hamletService;
  final MessageProducer producer;

  @Value("${rabbit-mq-config.update-hamlet.exchange_name}")
  String UPDATE_EXCHANGE_NAME;
  @Value("${rabbit-mq-config.update-hamlet.routing_key}")
  String UPDATE_ROUTING_KEY;

  @Value("${rabbit-mq-config.delete-hamlet.exchange_name}")
  String DELETE_EXCHANGE_NAME;
  @Value("${rabbit-mq-config.delete-hamlet.routing_key}")
  String DELETE_ROUTING_KEY;

  public HamletResponse createHamlet(@NonNull CreateHamletRequest request) {
    return hamletService.createHamlet(request.name(), HamletType.valueOf(request.type()), request.communeId());
  }

  public HamletResponse updateHamlet(String id, UpdateHamletRequest request) {
    var old = hamletService.getHamletById(id);
    var response = hamletService.updateHamlet(id, request);

    producer.send("UPDATE_HAMLET", UPDATE_EXCHANGE_NAME, UPDATE_ROUTING_KEY,
      new UpdateHamletEvent(
        old.name(), old.type(), old.communeName(),
        response.name(), response.type(), response.communeName()
      ));
    return response;
  }

  public void deleteHamlet(String id) {
    var old = hamletService.getHamletById(id);
    hamletService.deleteHamlet(id);

    producer.send("DELETE_HAMLET", DELETE_EXCHANGE_NAME, DELETE_ROUTING_KEY,
      new DeleteHamletEvent(old.name(), old.type(), old.communeName()));
  }

  public HamletResponse getHamletById(String id) {
    return hamletService.getHamletById(id);
  }

  public PageResponse<HamletResponse> getAllHamlets(Pageable pageable) {
    return hamletService.getAllHamlets(pageable);
  }
}
