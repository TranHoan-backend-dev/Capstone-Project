package com.capstone.device.infrastructure.persistence;

import com.capstone.device.domain.model.Unit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UnitRepository extends JpaRepository<Unit, String> {
  Page<Unit> findByNameContainsIgnoreCase(String name, Pageable pageable);

  boolean existsByNameIgnoreCase(String name);

  boolean existsByNameIgnoreCaseAndIdNot(String name, String id);
}
