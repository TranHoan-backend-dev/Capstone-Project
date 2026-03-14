package com.capstone.device.infrastructure.persistence;

import com.capstone.device.domain.model.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MaterialRepository extends JpaRepository<Material, String> {
  boolean existsByGroup_GroupId(String id);

  boolean existsByUnit_Id(String unitId);
}
