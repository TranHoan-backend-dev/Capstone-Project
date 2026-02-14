package com.capstone.construction.infrastructure.persistence;

import com.capstone.construction.domain.model.WaterSupplyNetwork;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WaterSupplyNetworkRepository extends JpaRepository<WaterSupplyNetwork, String> {
}
