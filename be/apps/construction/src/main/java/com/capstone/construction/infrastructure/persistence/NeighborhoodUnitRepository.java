package com.capstone.construction.infrastructure.persistence;

import com.capstone.construction.domain.model.NeighborhoodUnit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NeighborhoodUnitRepository extends JpaRepository<NeighborhoodUnit, String> {
  Optional<NeighborhoodUnit> findByName(String name);

  boolean existsByName(String name);

  boolean existsByCommune_CommuneId(String communeCommuneId);

  void deleteByCommune_CommuneId(String id);

  boolean existsByNameIgnoreCase(String name);

  Page<NeighborhoodUnit> findAllByNameContainsIgnoreCase(String keyword, Pageable pageable);

  Page<NeighborhoodUnit> findAllByCommune_CommuneId(String communeId, Pageable pageable);

  Page<NeighborhoodUnit> findAllByCommune_CommuneIdAndNameContainsIgnoreCase(String communeId, String keyword, Pageable pageable);
}
