package com.capstone.device.adapter.material;

import com.capstone.common.annotation.AppLog;
import com.capstone.device.application.business.material.MaterialService;
import com.capstone.device.application.business.material.estimate.MaterialsOfCostEstimateService;
import com.capstone.device.application.dto.response.material.MaterialsOfCostEstimateResponse;
import com.capstone.device.application.usecase.MaterialUseCase;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.slf4j.Logger;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@AppLog
@RestController
@RequestMapping("/materials/estimate")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CostEstimateController {
  final MaterialUseCase mUseCase;
  final MaterialService mService;
  final MaterialsOfCostEstimateService mOfCostEstimateService;
  Logger log;

  // <editor-fold> desc="cost estimate"
  @GetMapping("/{id}")
  public List<MaterialsOfCostEstimateResponse> getMaterialsOfCostEstimate(
    @PathVariable String id
  ) {
    return mOfCostEstimateService.getByEstimateId(id);
  }
  // </editor-fold>
}
