package com.capstone.device.domain.repository;

import com.capstone.device.domain.model.MaterialsOfSettlement;
import com.capstone.device.domain.model.utils.MaterialsOfSettlementId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MaterialsOfSettlementRepository extends JpaRepository<MaterialsOfSettlement, MaterialsOfSettlementId> {
}
