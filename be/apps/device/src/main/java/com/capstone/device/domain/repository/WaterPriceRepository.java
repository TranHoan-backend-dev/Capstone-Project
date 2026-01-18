package com.capstone.device.domain.repository;

import com.capstone.device.domain.model.WaterPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WaterPriceRepository extends JpaRepository<WaterPrice, String> {
}

