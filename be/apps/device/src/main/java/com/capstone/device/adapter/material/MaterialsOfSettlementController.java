package com.capstone.device.adapter.material;

import com.capstone.common.request.BaseMaterial;
import com.capstone.common.utils.Utils;
import com.capstone.device.application.business.material.settlement.MaterialsOfSettlementService;
import com.capstone.device.application.dto.response.material.MaterialsListResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/materials/settlement")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MaterialsOfSettlementController {
  MaterialsOfSettlementService materialsOfSettlementService;

  @Operation(hidden = true)
  @GetMapping("/{id}")
  @PreAuthorize("hasAnyAuthority('IT_STAFF', 'CONSTRUCTION_DEPARTMENT_HEAD', 'CONSTRUCTION_DEPARTMENT_STAFF')")
  public List<MaterialsListResponse> getMaterialsOfSettlement(@PathVariable String id) {
    log.info("Get material of settlement with id: {}", id);
    return materialsOfSettlementService.getByEstimateId(id);
  }

  @Operation(hidden = true)
  @PutMapping("/{id}")
  @PreAuthorize("hasAnyAuthority('IT_STAFF', 'CONSTRUCTION_DEPARTMENT_HEAD', 'CONSTRUCTION_DEPARTMENT_STAFF')")
  public ResponseEntity<?> updateMaterialsOfSettlement(
    @PathVariable String id,
    @RequestBody List<BaseMaterial> request
  ) {
    log.info("Updating settlement materials for id {}", id);
    materialsOfSettlementService.update(request, id);
    return Utils.returnOkResponse("Cập nhật bảng vật tư quyết toán thành công", null);
  }
}
