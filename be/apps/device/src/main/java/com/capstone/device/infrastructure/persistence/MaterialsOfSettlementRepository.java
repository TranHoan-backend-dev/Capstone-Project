package com.capstone.device.infrastructure.persistence;

import com.capstone.device.domain.model.MaterialsOfSettlement;
import com.capstone.device.domain.model.utils.MaterialsOfSettlementId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialsOfSettlementRepository extends JpaRepository<MaterialsOfSettlement, MaterialsOfSettlementId> {
  boolean existsByMaterial_MaterialId(String materialId);

  void deleteByMaterial_MaterialId(String materialMaterialId);

  List<MaterialsOfSettlement> findById_SettlementId(String idSettlementId);

  void deleteById_SettlementId(String idSettlementId);
}
