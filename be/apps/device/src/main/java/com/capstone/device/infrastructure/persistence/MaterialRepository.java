package com.capstone.device.infrastructure.persistence;

import com.capstone.device.domain.model.Material;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface MaterialRepository extends JpaRepository<Material, String> {
  boolean existsByGroup_GroupId(String id);

  boolean existsByUnit_Id(String unitId);

    @Query("SELECT m FROM Material m WHERE " +
           "(:jobContent IS NULL OR LOWER(m.jobContent) LIKE LOWER(CONCAT('%', :jobContent, '%'))) AND " +
           "(:laborCode IS NULL OR LOWER(m.laborCode) LIKE LOWER(CONCAT('%', :laborCode, '%'))) AND " +
           "(:groupId IS NULL OR m.group.groupId = :groupId) AND " +
           "(:minPrice IS NULL OR m.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR m.price <= :maxPrice)")
    Page<Material> searchMaterials(@Param("jobContent") String jobContent,
                                   @Param("laborCode") String laborCode,
                                   @Param("groupId") String groupId,
                                   @Param("minPrice") BigDecimal minPrice,
                                   @Param("maxPrice") BigDecimal maxPrice,
                                   Pageable pageable);
}