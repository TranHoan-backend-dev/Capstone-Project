package com.capstone.construction.domain.repository;

import com.capstone.construction.domain.model.Lateral;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LateralRepository extends JpaRepository<Lateral, String> {
}
