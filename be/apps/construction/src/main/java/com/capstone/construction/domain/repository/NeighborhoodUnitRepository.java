package com.capstone.construction.domain.repository;

import com.capstone.construction.domain.model.NeighborhoodUnit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NeighborhoodUnitRepository extends JpaRepository<NeighborhoodUnit, String> {
}
