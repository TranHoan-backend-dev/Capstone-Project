package com.capstone.device.application.usecase;

import com.capstone.device.application.business.watermeter.WaterMeterService;
import com.capstone.device.application.dto.response.water.OverallWaterMeterResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WaterMeterUseCase {
  WaterMeterService waterMeterService;

  public void deleteOverallWaterMeterByLateralId(String id) {
    waterMeterService.deleteOverallWaterMeterByLateralId(id);
  }

  public Page<OverallWaterMeterResponse> getAllOverallWaterMeters(Pageable pageable, String keyword) {
    return waterMeterService.getAllOverallWaterMeters(pageable, keyword);
  }
}
