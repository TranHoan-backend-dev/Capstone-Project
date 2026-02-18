package com.capstone.device.application.usecase;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.utils.Utils;
import com.capstone.device.application.business.waterprice.WaterPriceService;
import com.capstone.device.application.dto.request.WaterPriceRequest;
import com.capstone.device.application.dto.response.WaterPriceResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@AppLog
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WaterPriceUseCase {
  WaterPriceService waterPriceService;

  @NonFinal
  Logger log;

  public Page<WaterPriceResponse> getPricesList(@NonNull Pageable pageable, LocalDate filter) {
    log.info("Get prices list with index: {}, size: {}, filter: {}", pageable.getPageNumber(), pageable.getPageSize(), filter);
    return waterPriceService.getAllWaterPrices(pageable, filter);
  }

  public void createWaterPrice(@NonNull WaterPriceRequest request) {
    log.info("Create water price for target: {}", request.usageTarget());
    waterPriceService.createWaterPrice(request);
  }

  public WaterPriceResponse updateWaterPrice(String id, @NonNull WaterPriceRequest request) {
    log.info("Update water price for target: {}", request.usageTarget());
    return waterPriceService.updateWaterPrice(id, request);
  }

  public void deleteWaterPrice(@NonNull String id) {
    log.info("Delete water price for target: {}", id);
    waterPriceService.deleteWaterPrice(id);
  }

  public WaterPriceResponse getWaterPriceById(@NonNull String id) {
    log.info("Get water price for target: {}", id);
    return waterPriceService.getWaterPriceById(id);
  }
}
