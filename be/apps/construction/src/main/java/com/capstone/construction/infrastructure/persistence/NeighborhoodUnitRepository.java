package com.capstone.construction.infrastructure.persistence;

import com.capstone.construction.domain.model.NeighborhoodUnit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NeighborhoodUnitRepository extends JpaRepository<NeighborhoodUnit, String> {
    Optional<NeighborhoodUnit> findByName(String name);

    boolean existsByName(String name);
}
