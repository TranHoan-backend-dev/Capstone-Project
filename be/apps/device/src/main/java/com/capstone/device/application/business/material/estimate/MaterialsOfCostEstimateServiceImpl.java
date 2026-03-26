package com.capstone.device.application.business.material.estimate;

import com.capstone.common.request.BaseMaterial;
import com.capstone.device.application.dto.response.material.MaterialsOfCostEstimateResponse;
import com.capstone.device.domain.model.Material;
import com.capstone.device.domain.model.MaterialsOfCostEstimate;
import com.capstone.device.domain.model.utils.MaterialsOfCostEstimateId;
import com.capstone.device.infrastructure.persistence.MaterialRepository;
import com.capstone.device.infrastructure.persistence.MaterialsOfCostEstimateRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.PageRequest;
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
    log.info("Updating materials of cost estimate " + estimateId);
    repo.deleteById_CostEstId(estimateId);
    materials.forEach(material -> {
      var materialsOfCostEstimate = MaterialsOfCostEstimate.builder()
        .id(new MaterialsOfCostEstimateId(material.getMaterialCode(), estimateId))
        .material(materialRepository.findById(material.getMaterialCode()).orElseThrow(() -> new IllegalArgumentException("Khong tim thay vat tu")))
        .totalLaborCost(material.getTotalLaborPrice())
        .totalMaterialCost(material.getTotalMaterialPrice())
        .note(material.getNote())
        .mass(Float.parseFloat(material.getMass()))
        .build();
      repo.save(materialsOfCostEstimate);
    });
  }

  @Override
  public List<MaterialsOfCostEstimateResponse> getDefaultMaterial() {
    return materialRepository.findAll(PageRequest.of(0, 20))
      .getContent().stream().map(this::mapToResponse).toList();
  }

  private @NonNull MaterialsOfCostEstimateResponse mapToResponse(@NonNull Material m) {
    return new MaterialsOfCostEstimateResponse(
      m.getMaterialId(),
      m.getJobContent(),
      null,
      m.getUnit().getName(),
      0F,
      m.getPrice(),
      m.getLaborPrice(),
      m.getLaborPriceAtRuralCommune(),
      0F,
      0F
    );
  }

  private @NonNull MaterialsOfCostEstimateResponse mapToResponse(@NonNull MaterialsOfCostEstimate m) {
    var material = m.getMaterial();

    return new MaterialsOfCostEstimateResponse(
      m.getId().getMaterialId(),
      material.getJobContent(),
      m.getNote(),
      material.getUnit().getName(),
      m.getMass(),
      material.getPrice(),
      material.getLaborPrice(),
      material.getLaborPriceAtRuralCommune(),
      Float.parseFloat(m.getTotalLaborCost()),
      Float.parseFloat(m.getTotalMaterialCost())
    );
  }
}
