package com.capstone.construction.domain.repository;

import com.capstone.construction.domain.model.Commune;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommuneRepository extends JpaRepository<Commune, String> {
}
