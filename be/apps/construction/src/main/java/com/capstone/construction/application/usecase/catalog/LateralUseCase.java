package com.capstone.construction.application.usecase.catalog;

import com.capstone.construction.application.business.lateral.LateralService;
import com.capstone.construction.application.business.network.WaterSupplyNetworkService;
import com.capstone.construction.application.dto.request.catalog.LateralRequest;
import com.capstone.construction.application.dto.response.catalog.LateralResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.application.event.producer.lateral.DeleteLateralEvent;
import com.capstone.construction.application.event.producer.lateral.UpdateLateralEvent;
import com.capstone.construction.application.event.producer.MessageProducer;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LateralUseCase {
  final LateralService lateralService;
  final MessageProducer producer;
  final WaterSupplyNetworkService waterSupplyNetworkService;
  final String prefix = ".lateral.";

  @Value("${rabbit-mq-config.queue_name}" + prefix + "${rabbit-mq-config.update}")
  String UPDATE_ROUTING_KEY; // chu ky gan vao tin nhan khi gui den Exchange

  @Value("${rabbit-mq-config.queue_name}" + prefix + "${rabbit-mq-config.delete}")
  String DELETE_ROUTING_KEY;

  public LateralResponse createLateral(LateralRequest request) {
    return lateralService.createLateral(request);
  }

  @Transactional(rollbackFor = Exception.class)
  public LateralResponse updateLateral(String id, LateralRequest request) {
    var old = lateralService.getLateralById(id);
    var oldNetwork = waterSupplyNetworkService.getNetworkById(old.networkId());

    var response = lateralService.updateLateral(id, request);

    if (!request.name().isBlank() && !request.networkId().isBlank()) {
      producer.send(UPDATE_ROUTING_KEY,
        new UpdateLateralEvent(
          old.name(), response.name(),
          oldNetwork.name(), response.networkName()
        ));
    }
    return response;
  }

  @Transactional(rollbackFor = Exception.class)
  public void deleteLateral(String id) {
    var lateral = lateralService.getLateralById(id);
    lateralService.deleteLateral(id);

    producer.send(DELETE_ROUTING_KEY, new DeleteLateralEvent(lateral.name(), lateral.networkName()));
  }

  public LateralResponse getLateralById(String id) {
    return lateralService.getLateralById(id);
  }

  public PageResponse<LateralResponse> getAllLaterals(Pageable pageable) {
    return lateralService.getAllLaterals(pageable);
  }
}
