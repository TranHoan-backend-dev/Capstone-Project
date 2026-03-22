package com.capstone.organization.repository;

import com.capstone.organization.model.Department;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, String> {
  Page<Department> findByDepartmentIdContainsIgnoreCaseOrNameContainsIgnoreCaseOrPhoneNumberContains(String id, String name, String phoneNumber, Pageable pageable);

  boolean existsByPhoneNumber(String phoneNumber);

  boolean existsByNameIgnoreCase(@NotBlank String name);

  @Query("SELECT name FROM Department WHERE departmentId=:id")
  String findNameByDepartmentId(@Param("id") String departmentId);
}
