package com.capstone.device.infrastructure.persistence;

import com.capstone.device.domain.model.MaterialsOfCostEstimate;
import com.capstone.device.domain.model.utils.MaterialsOfCostEstimateId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialsOfCostEstimateRepository extends JpaRepository<MaterialsOfCostEstimate, MaterialsOfCostEstimateId> {
  boolean existsByMaterial_MaterialId(String materialId);

  void deleteByMaterial_MaterialId(String materialMaterialId);

  List<MaterialsOfCostEstimate> findById_CostEstId(String idCostEstId);

  void deleteById_CostEstId(String estimateId);
}
