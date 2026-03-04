package com.capstone.construction.infrastructure.persistence;

import com.capstone.construction.domain.model.WaterSupplyNetwork;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WaterSupplyNetworkRepository extends JpaRepository<WaterSupplyNetwork, String> {
  Page<WaterSupplyNetwork> findAllByNameContainsIgnoreCase(String name, Pageable pageable);

  boolean existsByNameIgnoreCase(String name);
}
