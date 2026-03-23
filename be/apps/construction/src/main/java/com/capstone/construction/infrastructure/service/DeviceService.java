package com.capstone.construction.infrastructure.service;

import com.capstone.common.config.feign.FeignAuthInterceptor;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.request.BaseMaterial;
import com.capstone.construction.application.dto.response.estimate.MaterialsOfCostEstimateResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(
  name = "device",
  path = "/api/v1",
  configuration = FeignAuthInterceptor.class
)
public interface DeviceService {
  @GetMapping("/water-meters/overall/{id}/exists")
  WrapperApiResponse isOverallMeterExisting(@PathVariable String id);

  @GetMapping("/water-meters/{id}/exists")
  Boolean isMeterExisting(@PathVariable String id);

  @DeleteMapping("/water-meters/overall/lateral")
  WrapperApiResponse deleteWaterMeter(@RequestParam String id);

  @GetMapping("/materials/default")
  List<MaterialsOfCostEstimateResponse> getDefaultMaterials();

  @GetMapping("/materials/estimate/{id}")
  List<MaterialsOfCostEstimateResponse> getMaterialsOfCostEstimate(@PathVariable String id);

  @PutMapping("/materials/estimate/{id}")
  WrapperApiResponse updateMaterialsOfCostEstimate(
    @PathVariable String id,
    @RequestBody List<BaseMaterial> request
  );
}
