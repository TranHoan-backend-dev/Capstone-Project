package com.capstone.device.infrastructure.persistence;

import com.capstone.device.domain.model.WaterPrice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface WaterPriceRepository extends JpaRepository<WaterPrice, String> {
  Page<WaterPrice> findAllByApplicationPeriodOrExpirationDate(LocalDate applicationPeriod, LocalDate expirationDate, Pageable pageable);

  boolean existsByDescription(String description);
}

