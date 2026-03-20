package com.capstone.device.application.business.material.estimate;

import com.capstone.common.request.BaseMaterial;
import com.capstone.device.application.dto.response.material.MaterialsOfCostEstimateResponse;
import com.capstone.device.domain.model.MaterialsOfCostEstimate;
import com.capstone.device.domain.model.utils.MaterialsOfCostEstimateId;
import com.capstone.device.infrastructure.persistence.MaterialRepository;
import com.capstone.device.infrastructure.persistence.MaterialsOfCostEstimateRepository;
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
public class MaterialsOfCostEstimateServiceImpl implements MaterialsOfCostEstimateService {
  MaterialsOfCostEstimateRepository repo;
  MaterialRepository materialRepository;

  @Override
  public List<MaterialsOfCostEstimateResponse> getByEstimateId(String id) {
    var result = repo.findById_CostEstId(id);
    log.info(result.toString());
    return result.stream().map(this::mapToResponse).collect(Collectors.toList());
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public void update(@NonNull List<BaseMaterial> materials, String estimateId) {
    repo.deleteById_CostEstId(estimateId);
    materials.forEach(material -> {
      var materialsOfCostEstimate = MaterialsOfCostEstimate.builder()
        .id(new MaterialsOfCostEstimateId(material.getMaterialCode(), estimateId))
        .material(materialRepository.findById(material.getMaterialCode()).orElseThrow(() -> new IllegalArgumentException("Khong tim thay vat tu")))
        .totalLaborCost(material.getLaborPrice())
        .totalMaterialCost(material.getMaterialCost())
        .note(material.getNote())
        .mass(Float.parseFloat(material.getMass()))
        .reductionCoefficient(Float.parseFloat(material.getReductionCoefficient()))
        .build();
      repo.save(materialsOfCostEstimate);
    });
  }

  private @NonNull MaterialsOfCostEstimateResponse mapToResponse(@NonNull MaterialsOfCostEstimate m) {
    var material = m.getMaterial();

    return new MaterialsOfCostEstimateResponse(
      m.getId().getMaterialId(),
      material.getJobContent(),
      m.getNote(),
      material.getUnit().getName(),
      m.getReductionCoefficient(),
      m.getMass(),
      material.getPrice().toString(),
      material.getLaborPrice().toString(),
      material.getLaborPriceAtRuralCommune().toString(),
      m.getTotalLaborCost(),
      m.getTotalMaterialCost()
    );
  }
}
