package com.capstone.construction.infrastructure.persistence;

import com.capstone.construction.domain.model.Roadmap;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoadmapRepository extends JpaRepository<Roadmap, String> {
  Optional<Roadmap> findByName(String name);

  boolean existsByName(String name);

  boolean existsByNameEqualsIgnoreCase(String name);

  @Query("""
    SELECT r
    FROM Roadmap r
    WHERE (:keyword IS NULL OR LOWER(CAST(r.name AS string)) LIKE LOWER(CONCAT('%', CAST(:keyword AS string), '%')))
      AND (:lateralId IS NULL OR r.lateral.id = :lateralId)
      AND (:networkId IS NULL OR r.network.branchId = :networkId)
    """)
  Page<Roadmap> searchRoadmaps(
    @Param("keyword") String keyword,
    @Param("lateralId") String lateralId,
    @Param("networkId") String networkId,
    Pageable pageable);
}
