package com.capstone.auth.domain.repository;

import com.capstone.auth.domain.model.BusinessPagesOfEmployees;
import com.capstone.auth.domain.model.id.BusinessPagesOfEmployeesId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BusinessPagesOfEmployeeRepository extends JpaRepository<BusinessPagesOfEmployees, BusinessPagesOfEmployeesId> {
  @Query("""
    SELECT bp
    FROM BusinessPagesOfEmployees bp
    WHERE bp.users.userId = :userId
    """)
  List<BusinessPagesOfEmployees> findByUsersUserId(@Param("userId") String userId);
}
