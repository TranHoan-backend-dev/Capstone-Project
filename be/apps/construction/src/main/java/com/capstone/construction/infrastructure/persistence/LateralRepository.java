package com.capstone.construction.infrastructure.persistence;

import com.capstone.construction.domain.model.Lateral;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LateralRepository extends JpaRepository<Lateral, String> {
  Optional<Lateral> findByName(String name);

  boolean existsByName(String name);

  boolean existsByNameIgnoreCase(String name);

  @Query("""
    SELECT l
    FROM Lateral l
      LEFT JOIN l.network n
    WHERE (LOWER(l.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
           (n IS NOT NULL AND LOWER(n.name) LIKE LOWER(CONCAT('%', :keyword, '%'))))
      AND (:networkId IS NULL OR :networkId = '' OR (n IS NOT NULL AND n.branchId = :networkId))
      AND (:networkAssigned IS NULL
           OR (:networkAssigned = TRUE AND n IS NOT NULL)
           OR (:networkAssigned = FALSE AND n IS NULL))
    """)
  Page<Lateral> searchLateralsWithKeyword(@Param("keyword") String keyword,
                                         @Param("networkId") String networkId,
                                         @Param("networkAssigned") Boolean networkAssigned,
                                         Pageable pageable);

  @Query("""
    SELECT l
    FROM Lateral l
      LEFT JOIN l.network n
    WHERE (:networkId IS NULL OR :networkId = '' OR (n IS NOT NULL AND n.branchId = :networkId))
      AND (:networkAssigned IS NULL
           OR (:networkAssigned = TRUE AND n IS NOT NULL)
           OR (:networkAssigned = FALSE AND n IS NULL))
    """)
  Page<Lateral> searchLateralsWithoutKeyword(@Param("networkId") String networkId,
                                            @Param("networkAssigned") Boolean networkAssigned,
                                            Pageable pageable);

  Boolean existsByNetwork_BranchId(String id);
}
