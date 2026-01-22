package com.capstone.construction.domain.repository;

import com.capstone.construction.domain.model.WaterSupplyNetwork;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WaterSupplyNetworkRepository extends JpaRepository<WaterSupplyNetwork, String> {
}
