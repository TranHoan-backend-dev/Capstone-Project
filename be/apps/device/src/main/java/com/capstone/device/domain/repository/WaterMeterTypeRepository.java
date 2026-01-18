package com.capstone.device.domain.repository;

import com.capstone.device.domain.model.WaterMeterType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WaterMeterTypeRepository extends JpaRepository<WaterMeterType, String> {
}

