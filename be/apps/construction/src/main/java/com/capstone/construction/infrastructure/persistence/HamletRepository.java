package com.capstone.construction.infrastructure.persistence;

import com.capstone.construction.domain.model.Hamlet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HamletRepository extends JpaRepository<Hamlet, String> {
  Optional<Hamlet> findByName(String name);

  boolean existsByName(String name);

  boolean existsByCommune_CommuneId(String communeCommuneId);

  void deleteByCommune_CommuneId(String id);

  boolean existsByNameIgnoreCase(String name);

  /**
   * Accent-insensitive search on hamlet name using PostgreSQL TRANSLATE.
   * Cho phép client gửi keyword không dấu (\"thon bon\") để tìm \"Thôn Bốn\".
   */
  @Query(
    value = """
      SELECT *
      FROM hamlet h
      WHERE LOWER(TRANSLATE(h.name,
                            :accented,
                            :unaccented))
            LIKE CONCAT('%',
                        LOWER(TRANSLATE(:keyword,
                                        :accented,
                                        :unaccented)),
                        '%')
      """,
    countQuery = """
      SELECT COUNT(*)
      FROM hamlet h
      WHERE LOWER(TRANSLATE(h.name,
                            :accented,
                            :unaccented))
            LIKE CONCAT('%',
                        LOWER(TRANSLATE(:keyword,
                                        :accented,
                                        :unaccented)),
                        '%')
      """,
    nativeQuery = true)
  Page<Hamlet> searchByNameAccentInsensitive(
    @Param("keyword") String keyword,
    @Param("accented") String accented,
    @Param("unaccented") String unaccented,
    Pageable pageable);
}
