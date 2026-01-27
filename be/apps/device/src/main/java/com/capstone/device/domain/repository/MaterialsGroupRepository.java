package com.capstone.device.domain.repository;

import com.capstone.device.domain.model.MaterialsGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MaterialsGroupRepository extends JpaRepository<MaterialsGroup, String> {
}

