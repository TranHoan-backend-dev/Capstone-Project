package com.capstone.device.domain.repository;

import com.capstone.device.domain.model.UsageHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsageHistoryRepository extends JpaRepository<UsageHistory, String> {
}
