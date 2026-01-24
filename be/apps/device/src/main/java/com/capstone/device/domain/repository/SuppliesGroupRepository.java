package com.capstone.device.domain.repository;

import com.capstone.device.domain.model.SuppliesGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SuppliesGroupRepository extends JpaRepository<SuppliesGroup, String> {
}

