package com.capstone.construction.infrastructure.persistence;

import com.capstone.construction.domain.model.Road;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RoadRepository extends JpaRepository<Road, String> {
  boolean existsByNameIgnoreCase(String name);

  /**
   * Search theo tên, bỏ dấu và không phân biệt hoa thường.
   * Yêu cầu Postgres đã enable extension: CREATE EXTENSION IF NOT EXISTS unaccent;
   */
  @Query(
    value = "SELECT * FROM road r " +
            "WHERE unaccent(lower(r.name)) LIKE concat('%', unaccent(lower(:keyword)), '%')",
    countQuery = "SELECT count(*) FROM road r " +
                 "WHERE unaccent(lower(r.name)) LIKE concat('%', unaccent(lower(:keyword)), '%')",
    nativeQuery = true
  )
  Page<Road> searchByNameIgnoreAccent(@Param("keyword") String keyword, Pageable pageable);
}
