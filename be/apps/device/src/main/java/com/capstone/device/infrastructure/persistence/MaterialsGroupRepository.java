package com.capstone.device.infrastructure.persistence;

import com.capstone.device.domain.model.MaterialsGroup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MaterialsGroupRepository extends JpaRepository<MaterialsGroup, String> {
    Page<MaterialsGroup> findByNameContainsIgnoreCase(String name, Pageable pageable);
}

