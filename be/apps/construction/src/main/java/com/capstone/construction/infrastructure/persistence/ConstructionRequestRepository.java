package com.capstone.construction.infrastructure.persistence;

import com.capstone.construction.domain.model.ConstructionRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConstructionRequestRepository extends JpaRepository<ConstructionRequest, String> {
}
