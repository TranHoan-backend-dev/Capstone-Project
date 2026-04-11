package com.capstone.device.application.business.watermeter;

import com.capstone.device.application.dto.request.WaterMeterRequest;
import com.capstone.device.application.dto.response.water.OverallWaterMeterResponse;
import com.capstone.device.application.dto.response.water.WaterMeterResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface WaterMeterService {
  WaterMeterResponse createWaterMeter(WaterMeterRequest request);

  WaterMeterResponse updateWaterMeter(String id, WaterMeterRequest request);

  void deleteWaterMeter(String id);

  WaterMeterResponse getWaterMeterById(String id);

  Page<WaterMeterResponse> getAllWaterMeters(Pageable pageable);

  boolean isWaterMeterExisting(String id);

  boolean isOverallWaterMeterExisting(String id);

  void deleteOverallWaterMeterByLateralId(String id);

  Page<OverallWaterMeterResponse> getAllOverallWaterMeters(Pageable pageable, String keyword);

  String getNameById(String id);
}
