package com.capstone.device.infrastructure.persistence;

import com.capstone.device.domain.model.UsageHistory;
import com.capstone.device.domain.model.WaterMeter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsageHistoryRepository extends JpaRepository<UsageHistory, String> {
  Optional<UsageHistory> findByMeter(WaterMeter meter);
}
