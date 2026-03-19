package com.capstone.construction.infrastructure.service;

import com.capstone.common.config.feign.FeignAuthInterceptor;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.construction.application.dto.response.material.MaterialResponse;
import com.capstone.construction.application.dto.response.material.MaterialsOfCostEstimateResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(
  name = "device",
  path = "/api/v1/water-meters",
  configuration = FeignAuthInterceptor.class
)
public interface DeviceService {
  @GetMapping("/water-meters/overall/{id}/exists")
  WrapperApiResponse isOverallMeterExisting(@PathVariable String id);

  @GetMapping("/water-meters/{id}/exists")
  WrapperApiResponse isMeterExisting(@PathVariable String id);

  @DeleteMapping("/water-meters/overall/lateral")
  WrapperApiResponse deleteWaterMeter(@RequestParam String id);

  @GetMapping("/materials/default")
  List<MaterialResponse> getDefaultMaterials();

  @GetMapping("/materials/estimate/{id}")
  List<MaterialsOfCostEstimateResponse> getMaterialsOfCostEstimate(@PathVariable String id);
}
