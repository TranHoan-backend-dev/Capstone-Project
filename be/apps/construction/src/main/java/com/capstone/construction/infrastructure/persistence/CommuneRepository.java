package com.capstone.construction.infrastructure.persistence;

import com.capstone.construction.domain.model.Commune;
import com.capstone.construction.domain.enumerate.CommuneType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CommuneRepository extends JpaRepository<Commune, String> {
  Optional<Commune> findByName(String name);

  boolean existsByName(String name);

  boolean existsByNameIgnoreCase(String name);

  Page<Commune> findAllByType(CommuneType type, Pageable pageable);

  Page<Commune> findAllByNameSearchContains(String nameSearch, Pageable pageable);

  Page<Commune> findAllByNameSearchContainsAndType(String nameSearch, CommuneType type, Pageable pageable);
}
