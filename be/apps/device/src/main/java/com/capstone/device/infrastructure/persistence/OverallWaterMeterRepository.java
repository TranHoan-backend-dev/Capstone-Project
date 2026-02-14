package com.capstone.device.infrastructure.persistence;

import com.capstone.device.domain.model.OverallWaterMeter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OverallWaterMeterRepository extends JpaRepository<OverallWaterMeter, String> {
}

