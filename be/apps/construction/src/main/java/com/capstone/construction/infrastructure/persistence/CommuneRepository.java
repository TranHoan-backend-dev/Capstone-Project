package com.capstone.construction.infrastructure.persistence;

import com.capstone.construction.domain.model.Commune;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CommuneRepository extends JpaRepository<Commune, String> {
  Optional<Commune> findByName(String name);

  boolean existsByName(String name);

  boolean existsByNameIgnoreCase(String name);
}
