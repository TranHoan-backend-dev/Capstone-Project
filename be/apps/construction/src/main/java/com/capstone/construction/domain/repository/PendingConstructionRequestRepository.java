package com.capstone.construction.domain.repository;

import com.capstone.construction.domain.model.ConstructionRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PendingConstructionRequestRepository extends JpaRepository<ConstructionRequest, String> {
}
