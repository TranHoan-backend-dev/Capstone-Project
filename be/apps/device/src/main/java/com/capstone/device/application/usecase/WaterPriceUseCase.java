package com.capstone.device.application.usecase;

import com.capstone.device.application.business.waterprice.WaterPriceService;
import com.capstone.device.application.dto.request.price.CreateRequest;
import com.capstone.device.application.dto.request.price.UpdateRequest;
import com.capstone.device.application.dto.response.WaterPriceResponse;
import com.capstone.device.application.event.producer.MessageProducer;
import com.capstone.device.infrastructure.service.CustomerService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WaterPriceUseCase {
  final WaterPriceService waterPriceService;
  final MessageProducer producer;
  final CustomerService customerService;
  static final String PREFIX = ".water-price.";

  @Value("${rabbit-mq-config.queue}" + PREFIX + "${rabbit-mq-config.actions[0]}")
  String UPDATE_ROUTING_KEY;

  @Value("${rabbit-mq-config.queue}" + PREFIX + "${rabbit-mq-config.actions[1]}")
  String DELETE_ROUTING_KEY;

  public Page<WaterPriceResponse> getPricesList(@NonNull Pageable pageable, LocalDate filter) {
    return waterPriceService.getAllWaterPrices(pageable, filter);
  }

  public WaterPriceResponse createWaterPrice(@NonNull CreateRequest request) {
    return waterPriceService.createWaterPrice(request);
  }

  @Transactional(rollbackFor = Exception.class)
  public WaterPriceResponse updateWaterPrice(String id, @NonNull UpdateRequest request) {
//    var old = waterPriceService.getWaterPriceById(id);
    var n = waterPriceService.updateWaterPrice(id, request);

//    producer.send(UPDATE_ROUTING_KEY, new UpdateEvent(
//        old.usageTarget(), old.tax(), old.environmentPrice(), old.applicationPeriod(),
//        old.expirationDate(), old.description(),
//        n.usageTarget(), n.tax(), n.environmentPrice(), n.applicationPeriod(),
//        n.expirationDate(), n.description()));
    return n;
  }

  @Transactional(rollbackFor = Exception.class)
  public void deleteWaterPrice(@NonNull String id) {
//    var status = customerService.checkWhetherCustomersAreApplied(id).data();
//    if (Boolean.parseBoolean((String) status)) {
//      throw new IllegalArgumentException(Constant.ENT_48);
//    }

//    var old = waterPriceService.getWaterPriceById(id);
    waterPriceService.deleteWaterPrice(id);

//    producer.send(DELETE_ROUTING_KEY, new DeleteEvent(
//        old.usageTarget(), old.tax(), old.environmentPrice(), old.applicationPeriod(),
//        old.expirationDate(), old.description()));
  }

  public WaterPriceResponse getWaterPriceById(@NonNull String id) {
    return waterPriceService.getWaterPriceById(id);
  }
}
