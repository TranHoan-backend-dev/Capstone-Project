package com.capstone.construction.domain.repository;

import com.capstone.construction.domain.model.CostEstimate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EstimationRepository extends JpaRepository<CostEstimate, String> {
}
