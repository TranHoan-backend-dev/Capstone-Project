package com.capstone.construction.infrastructure.service;

import com.capstone.common.config.feign.FeignAuthInterceptor;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.request.BaseMaterial;
import com.capstone.construction.application.dto.response.MaterialsResponse;
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

  @GetMapping("/materials/estimate/default")
  List<MaterialsResponse> getDefaultMaterials();

  // <editor-fold> desc="cost estimate"
  @GetMapping("/materials/estimate/{id}")
  List<MaterialsResponse> getMaterialsOfCostEstimate(@PathVariable String id);

  @PutMapping("/materials/estimate/{id}")
  WrapperApiResponse updateMaterialsOfCostEstimate(
    @PathVariable String id,
    @RequestBody List<BaseMaterial> request
  );
  // </editor-fold>
  @GetMapping("/materials/settlement/{id}")
  List<MaterialsResponse> getMaterialsOfSettlement(@PathVariable String id);

  @PutMapping("/materials/settlement/{id}")
  WrapperApiResponse updateMaterialsOfSettlement(
    @PathVariable String id,
    @RequestBody List<BaseMaterial> request
  );
  // <editor-fold> desc="settlement"

  @GetMapping("/meter-types/exist/{id}")
  boolean isMeterTypeExist(@PathVariable String id);

  @GetMapping("/water-meters/overall/name/{id}")
  String getNameById(@PathVariable String id);
}
