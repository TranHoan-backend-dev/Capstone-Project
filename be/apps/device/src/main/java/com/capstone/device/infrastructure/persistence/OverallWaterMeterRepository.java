package com.capstone.device.infrastructure.persistence;

import com.capstone.device.domain.model.OverallWaterMeter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OverallWaterMeterRepository extends JpaRepository<OverallWaterMeter, String> {
  void deleteByLateralId(String lateralId);

  boolean existsByLateralId(String lateralId);

  Page<OverallWaterMeter> findByNameContainingIgnoreCase(String name, Pageable pageable);
}

