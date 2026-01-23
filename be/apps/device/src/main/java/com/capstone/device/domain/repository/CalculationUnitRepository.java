package com.capstone.device.domain.repository;

import com.capstone.device.domain.model.CalculationUnit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CalculationUnitRepository extends JpaRepository<CalculationUnit, String> {
}

