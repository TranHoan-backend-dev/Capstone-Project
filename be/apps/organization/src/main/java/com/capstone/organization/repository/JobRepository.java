package com.capstone.organization.repository;

import com.capstone.organization.model.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface JobRepository extends JpaRepository<Job, String> {
  @Query(value = "SELECT * FROM job j WHERE " +
                 "(CAST(:name AS TEXT) IS NULL OR unaccent(lower(j.name)) LIKE concat('%', unaccent(lower(CAST(:name AS TEXT))), '%')) AND " +
                 "(CAST(:start AS TIMESTAMP) IS NULL OR j.created_at >= CAST(:start AS TIMESTAMP)) AND " +
                 "(CAST(:end AS TIMESTAMP) IS NULL OR j.created_at <= CAST(:end AS TIMESTAMP))",
         countQuery = "SELECT count(*) FROM job j WHERE " +
                      "(CAST(:name AS TEXT) IS NULL OR unaccent(lower(j.name)) LIKE concat('%', unaccent(lower(CAST(:name AS TEXT))), '%')) AND " +
                      "(CAST(:start AS TIMESTAMP) IS NULL OR j.created_at >= CAST(:start AS TIMESTAMP)) AND " +
                      "(CAST(:end AS TIMESTAMP) IS NULL OR j.created_at <= CAST(:end AS TIMESTAMP))",
         nativeQuery = true)
  Page<Job> searchJobs(@Param("name") String name,
                       @Param("start") LocalDateTime start,
                       @Param("end") LocalDateTime end,
                       Pageable pageable);

  boolean existsByNameIgnoreCase(String name);

  Optional<Job> findByNameIgnoreCase(String name);
}
