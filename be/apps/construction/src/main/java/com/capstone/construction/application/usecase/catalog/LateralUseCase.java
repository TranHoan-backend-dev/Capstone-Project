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

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LateralUseCase {
  final LateralService lateralService;
  final MessageProducer producer;
  final WaterSupplyNetworkService waterSupplyNetworkService;

  @Value("${rabbit-mq-config.update-lateral.exchange_name}")
  String UPDATE_EXCHANGE_NAME;
  @Value("${rabbit-mq-config.update-lateral.routing_key}")
  String UPDATE_ROUTING_KEY;

  @Value("${rabbit-mq-config.delete-lateral.exchange_name}")
  String DELETE_EXCHANGE_NAME;
  @Value("${rabbit-mq-config.delete-lateral.routing_key}")
  String DELETE_ROUTING_KEY;

  public LateralResponse createLateral(LateralRequest request) {
    return lateralService.createLateral(request);
  }

  public LateralResponse updateLateral(String id, LateralRequest request) {
    var old = lateralService.getLateralById(id);
    var oldNetwork = waterSupplyNetworkService.getNetworkById(old.networkId());

    var response = lateralService.updateLateral(id, request);
    producer.send(
      "UPDATE_LATERAL",
      UPDATE_EXCHANGE_NAME, UPDATE_ROUTING_KEY,
      new UpdateLateralEvent(
        old.name(), response.name(),
        oldNetwork.name(), response.networkName()
      ));
    return response;
  }

  public void deleteLateral(String id) {
    var lateral = lateralService.getLateralById(id);
    lateralService.deleteLateral(id);

    producer.send("DELETE_LATERAL",
      DELETE_EXCHANGE_NAME, DELETE_ROUTING_KEY,
      new DeleteLateralEvent(lateral.name(), lateral.networkName())
    );
  }

  public LateralResponse getLateralById(String id) {
    return lateralService.getLateralById(id);
  }

  public PageResponse<LateralResponse> getAllLaterals(Pageable pageable) {
    return lateralService.getAllLaterals(pageable);
  }
}
