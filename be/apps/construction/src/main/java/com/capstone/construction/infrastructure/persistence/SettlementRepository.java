package com.capstone.construction.infrastructure.persistence;

import com.capstone.construction.domain.model.Settlement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SettlementRepository extends JpaRepository<Settlement, String> {
}
