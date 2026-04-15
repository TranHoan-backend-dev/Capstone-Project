package com.capstone.device.application.business.material.settlement;

import com.capstone.common.request.BaseMaterial;
import com.capstone.device.application.dto.response.material.MaterialsListResponse;
import com.capstone.device.domain.model.MaterialsOfSettlement;
import com.capstone.device.domain.model.utils.MaterialsOfSettlementId;
import com.capstone.device.infrastructure.persistence.MaterialRepository;
import com.capstone.device.infrastructure.persistence.MaterialsOfSettlementRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MaterialsOfSettlementServiceImpl implements MaterialsOfSettlementService {
  MaterialsOfSettlementRepository repo;
  MaterialRepository materialRepository;

  @Override
  public List<MaterialsListResponse> getByEstimateId(String id) {
    var result = repo.findById_SettlementId(id);
    log.info(result.toString());
    return result.stream().map(this::mapToResponse).collect(Collectors.toList());
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public void update(@NonNull List<BaseMaterial> materials, String settlementId) {
    log.info("Updating materials of settlement {}", settlementId);
    repo.deleteById_SettlementId(settlementId);
    materials.forEach(material -> {
      var materialsOfSettlement = MaterialsOfSettlement.builder()
        .id(new MaterialsOfSettlementId(material.getMaterialCode(), settlementId))
        .material(materialRepository.findById(material.getMaterialCode()).orElseThrow(() -> new IllegalArgumentException("Khong tim thay vat tu")))
        .laborCost(material.getTotalLaborPrice())
        .materialCost(material.getTotalMaterialPrice())
        .note(material.getNote())
        .mass(Float.parseFloat(material.getMass()))
        .build();
      repo.save(materialsOfSettlement);
    });
  }

  private @NonNull MaterialsListResponse mapToResponse(@NonNull MaterialsOfSettlement m) {
    var material = m.getMaterial();

    return new MaterialsListResponse(
      m.getId().getMaterialId(),
      material.getJobContent(),
      m.getNote(),
      material.getUnit().getName(),
      m.getMass(),
      material.getPrice(),
      material.getLaborPrice(),
      material.getLaborPriceAtRuralCommune(),
      Float.parseFloat(m.getLaborCost()),
      Float.parseFloat(m.getMaterialCost())
    );
  }
}
