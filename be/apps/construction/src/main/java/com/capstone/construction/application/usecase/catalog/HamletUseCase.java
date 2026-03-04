package com.capstone.construction.application.usecase.catalog;

import com.capstone.construction.application.business.hamlet.HamletService;
import com.capstone.construction.application.dto.request.hamlet.CreateHamletRequest;
import com.capstone.construction.application.dto.request.hamlet.UpdateHamletRequest;
import com.capstone.construction.application.dto.response.catalog.HamletResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.application.event.producer.MessageProducer;
import com.capstone.construction.application.event.producer.hamlet.DeleteHamletEvent;
import com.capstone.construction.application.event.producer.hamlet.UpdateHamletEvent;
import com.capstone.construction.domain.enumerate.CommuneType;
import com.capstone.construction.domain.enumerate.HamletType;
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
public class HamletUseCase {
  final HamletService hamletService;
  final MessageProducer producer;
  final String prefix = ".hamlet.";

  @Value("${rabbit-mq-config.queue_name}" + prefix + "${rabbit-mq-config.update}")
  String UPDATE_ROUTING_KEY;

  @Value("${rabbit-mq-config.queue_name}" + prefix + "${rabbit-mq-config.delete}")
  String DELETE_ROUTING_KEY;

  public HamletResponse createHamlet(@NonNull CreateHamletRequest request) {
    return hamletService.createHamlet(request.name(), HamletType.valueOf(request.type()), request.communeId());
  }

  @Transactional(rollbackFor = Exception.class)
  public HamletResponse updateHamlet(String id, UpdateHamletRequest request) {
    var old = hamletService.getHamletById(id);
    var response = hamletService.updateHamlet(id, request);

    if (!request.name().isBlank() && !request.type().isBlank() && !request.communeId().isBlank()) {
      var newHamletType = HamletType.valueOf(request.type()).equals(HamletType.VILLAGE) ? "Làng" : "Thôn";
      var oldHamletType = HamletType.valueOf(old.type()).equals(HamletType.VILLAGE) ? "Làng" : "Thôn";
      producer.send(UPDATE_ROUTING_KEY,
        new UpdateHamletEvent(
          old.name(), oldHamletType, old.communeName(),
          response.name(), newHamletType, response.communeName()
        ));
    }
    return response;
  }

  @Transactional(rollbackFor = Exception.class)
  public void deleteHamlet(String id) {
    var old = hamletService.getHamletById(id);
    hamletService.deleteHamlet(id);

    producer.send(DELETE_ROUTING_KEY,
      new DeleteHamletEvent(old.name(), old.type(), old.communeName()));
  }

  public HamletResponse getHamletById(String id) {
    return hamletService.getHamletById(id);
  }

  public PageResponse<HamletResponse> getAllHamlets(Pageable pageable) {
    return hamletService.getAllHamlets(pageable);
  }

  public PageResponse<HamletResponse> searchHamletsByName(String keyword, Pageable pageable) {
    return hamletService.searchHamletsByName(keyword, pageable);
  }
}
