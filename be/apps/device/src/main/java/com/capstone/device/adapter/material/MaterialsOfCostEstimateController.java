package com.capstone.device.adapter.material;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.request.BaseMaterial;
import com.capstone.common.utils.Utils;
import com.capstone.device.application.business.material.estimate.MaterialsOfCostEstimateService;
import com.capstone.device.application.dto.response.material.MaterialsListResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.slf4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AppLog
@RestController
@RequestMapping("/materials/estimate")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MaterialsOfCostEstimateController {
  final MaterialsOfCostEstimateService mOfCostEstimateService;
  Logger log;

  @Operation(hidden = true)
  @GetMapping("/{id}")
  @PreAuthorize("hasAnyAuthority('IT_STAFF', 'PLANNING_TECHNICAL_DEPARTMENT_HEAD', 'SURVEY_STAFF', 'COMPANY_LEADERSHIP')")
  public List<MaterialsListResponse> getMaterialsOfCostEstimate(@PathVariable String id) {
    log.info("Get material of cost estimate with id: {}", id);
    return mOfCostEstimateService.getByEstimateId(id);
  }

  @Operation(hidden = true)
  @PutMapping("/{id}")
  @PreAuthorize("hasAnyAuthority('IT_STAFF', 'PLANNING_TECHNICAL_DEPARTMENT_HEAD', 'SURVEY_STAFF')")
  public ResponseEntity<?> updateMaterialsOfCostEstimate(
    @PathVariable String id,
    @RequestBody List<BaseMaterial> request
  ) {
    log.info("Updating cost estimate for material id {}", id);
    mOfCostEstimateService.update(request, id);
    return Utils.returnOkResponse("Cập nhật bảng vật tư dự toán thành công", null);
  }

  @Operation(hidden = true)
  @GetMapping("/default")
  @PreAuthorize("hasAnyAuthority('IT_STAFF', 'PLANNING_TECHNICAL_DEPARTMENT_HEAD', 'SURVEY_STAFF', 'CONSTRUCTION_DEPARTMENT_STAFF')")
  public List<MaterialsListResponse> getDefaultMaterial() {
    log.info("REST request to get default material");
    return mOfCostEstimateService.getDefaultMaterial();
  }
}
