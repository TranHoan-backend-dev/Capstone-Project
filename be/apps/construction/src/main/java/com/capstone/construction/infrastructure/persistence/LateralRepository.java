package com.capstone.construction.infrastructure.persistence;

import com.capstone.construction.domain.model.Lateral;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LateralRepository extends JpaRepository<Lateral, String> {
  Optional<Lateral> findByName(String name);

  boolean existsByName(String name);

  boolean existsByNameIgnoreCase(String name);
}
