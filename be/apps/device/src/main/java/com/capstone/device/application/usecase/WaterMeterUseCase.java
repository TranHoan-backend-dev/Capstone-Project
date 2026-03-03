package com.capstone.device.application.usecase;

import com.capstone.device.application.business.watermeter.WaterMeterService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WaterMeterUseCase {
  WaterMeterService waterMeterService;

  public void deleteOverallWaterMeterByLateralId(String id) {
    waterMeterService.deleteOverallWaterMeterByLateralId(id);
  }
}
