package com.capstone.auth.infrastructure.persistence;

import com.capstone.auth.domain.model.EmployeeJob;
import com.capstone.auth.domain.model.Users;
import com.capstone.auth.domain.model.utils.EmployeeJobId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeJobRepository extends JpaRepository<EmployeeJob, EmployeeJobId> {
  @Modifying
  @Query("""
    INSERT INTO EmployeeJob (users, id)
    VALUES (:user, :id)
    """)
  List<EmployeeJob> create(@Param("user") Users user, @Param("id") EmployeeJobId id);

  boolean existsByIdJobId(String jobId);
}
