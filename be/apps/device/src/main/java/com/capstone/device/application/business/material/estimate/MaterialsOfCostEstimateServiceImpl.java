package com.capstone.device.application.business.material.estimate;

import com.capstone.device.application.dto.response.material.MaterialsOfCostEstimateResponse;
import com.capstone.device.domain.model.MaterialsOfCostEstimate;
import com.capstone.device.infrastructure.persistence.MaterialsOfCostEstimateRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MaterialsOfCostEstimateServiceImpl implements MaterialsOfCostEstimateService {
  MaterialsOfCostEstimateRepository repo;

  @Override
  public List<MaterialsOfCostEstimateResponse> getByEstimateId(String id) {
    var result = repo.findById_CostEstId(id);
    log.info(result.toString());
    return result.stream().map(this::mapToResponse).collect(Collectors.toList());
  }

  private @NonNull MaterialsOfCostEstimateResponse mapToResponse(@NonNull MaterialsOfCostEstimate m) {
    return new MaterialsOfCostEstimateResponse(
      m.getId().getMaterialId(),
      m.getMaterial().getPrice().toString(),
      m.getLaborCost(),
      m.getTotalLaborCost(),
      m.getMaterialCost(),
      m.getTotalMaterialCost(),
      m.getNote(),
      m.getMass(),
      m.getReductionCoefficient()
    );
  }
}
