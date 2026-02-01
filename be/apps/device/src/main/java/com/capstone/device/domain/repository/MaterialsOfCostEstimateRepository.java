package com.capstone.device.domain.repository;

import com.capstone.device.domain.model.MaterialsOfCostEstimate;
import com.capstone.device.domain.model.utils.MaterialsOfCostEstimateId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MaterialsOfCostEstimateRepository extends JpaRepository<MaterialsOfCostEstimate, MaterialsOfCostEstimateId> {
}
