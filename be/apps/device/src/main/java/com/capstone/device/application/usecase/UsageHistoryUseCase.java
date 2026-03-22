package com.capstone.device.application.usecase;

import com.capstone.device.application.business.usagehistory.UsageHistoryService;
import com.capstone.device.application.business.watermeter.WaterMeterService;
import com.capstone.device.application.dto.request.UsageHistoryRequest;
import com.capstone.device.application.dto.response.pricetype.UsageResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import com.capstone.device.infrastructure.service.GcsService;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UsageHistoryUseCase {
  WaterMeterService waterMeterService;
  UsageHistoryService usageHistoryService;
  GcsService service;

  public UsageResponse updateWaterIndex(UsageHistoryRequest request, String serial) {
    if (!waterMeterService.isWaterMeterExisting(serial)) {
      throw new IllegalArgumentException("Serial " + serial + " does not exist");
    }
    var url = service.upload(request.image());
    return usageHistoryService.addWaterIndexOfThisMonth(url, serial, request.index(), request.recordingDate());
  }

  public void updatePaymentStatus(String serial, String method) {
    usageHistoryService.updatePaymentStatus(serial, method);
  }
}
