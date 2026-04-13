package com.capstone.construction.infrastructure.persistence;

import com.capstone.construction.domain.model.Hamlet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface HamletRepository extends JpaRepository<Hamlet, String> {
  boolean existsByCommune_CommuneId(String communeCommuneId);

  void deleteByCommune_CommuneId(String id);

  boolean existsByNameIgnoreCase(String name);

  /**
   * Tăng cường Search: Hỗ trợ tìm kiếm theo tên (không dấu/có dấu), communeId và type.
   * Các tham số có thể null.
   */
  @Query(
    value = """
      SELECT *
      FROM hamlet h
      WHERE (CAST(:keyword AS VARCHAR) IS NULL OR LOWER(TRANSLATE(h.name, :accented, :unaccented)) LIKE CONCAT('%', LOWER(TRANSLATE(CAST(:keyword AS VARCHAR), :accented, :unaccented)), '%'))
        AND (CAST(:communeId AS VARCHAR) IS NULL OR h.commune_id = CAST(:communeId AS VARCHAR))
        AND (CAST(:type AS VARCHAR) IS NULL OR h.type = CAST(:type AS VARCHAR))
      """,
    countQuery = """
      SELECT COUNT(*)
      FROM hamlet h
      WHERE (CAST(:keyword AS VARCHAR) IS NULL OR LOWER(TRANSLATE(h.name, :accented, :unaccented)) LIKE CONCAT('%', LOWER(TRANSLATE(CAST(:keyword AS VARCHAR), :accented, :unaccented)), '%'))
        AND (CAST(:communeId AS VARCHAR) IS NULL OR h.commune_id = CAST(:communeId AS VARCHAR))
        AND (CAST(:type AS VARCHAR) IS NULL OR h.type = CAST(:type AS VARCHAR))
      """,
    nativeQuery = true)
  Page<Hamlet> searchHamlets(
    @Param("keyword") String keyword,
    @Param("communeId") String communeId,
    @Param("type") String type,
    @Param("accented") String accented,
    @Param("unaccented") String unaccented,
    Pageable pageable);
}
