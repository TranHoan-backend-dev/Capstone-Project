package com.capstone.device.adapter.material;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.request.BaseMaterial;
import com.capstone.common.utils.Utils;
import com.capstone.device.application.business.material.estimate.MaterialsOfCostEstimateService;
import com.capstone.device.application.dto.response.material.MaterialsOfCostEstimateResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.slf4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AppLog
@RestController
@RequestMapping("/materials/estimate")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CostEstimateController {
  final MaterialsOfCostEstimateService mOfCostEstimateService;
  Logger log;

  @Operation(hidden = true)
  @GetMapping("/{id}")
  public List<MaterialsOfCostEstimateResponse> getMaterialsOfCostEstimate(
    @PathVariable String id
  ) {
    return mOfCostEstimateService.getByEstimateId(id);
  }

  @Operation(hidden = true)
  @PutMapping("/{id}")
  public ResponseEntity<?> updateMaterialsOfCostEstimate(
    @PathVariable String id,
    @RequestBody List<BaseMaterial> request
  ) {
    log.info("Updating cost estimate for material id {}", id);
    mOfCostEstimateService.update(request, id);
    return Utils.returnOkResponse("Cập nhật bảng vật tư dự toán thành công", null);
  }
}
