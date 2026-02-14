package com.capstone.auth.infrastructure.persistence;

import com.capstone.auth.domain.model.BusinessPagesOfEmployees;
import com.capstone.auth.domain.model.utils.BusinessPagesOfEmployeesId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BusinessPagesOfEmployeeRepository
  extends JpaRepository<BusinessPagesOfEmployees, BusinessPagesOfEmployeesId> {
  @Query("""
    SELECT bp
    FROM BusinessPagesOfEmployees bp
    WHERE bp.users.userId = :userId
    """)
  List<BusinessPagesOfEmployees> findByUsersUserId(@Param("userId") String userId);

  @Modifying
  @Query("""
    DELETE FROM BusinessPagesOfEmployees bp
    WHERE bp.users.userId = :userId
    AND NOT EXISTS (
        SELECT 1 FROM Temp t WHERE t.content = bp.id.pageId
        )
    """)
  void deleteDistinctRecord(@Param("userId") String userId);

  @Modifying
  @Query(value = """
    INSERT INTO business_pages_of_employees (users_user_id, page_id)
    SELECT :userId, t.content
    FROM temp t
    WHERE NOT EXISTS (
        SELECT 1
        FROM business_pages_of_employees bp
        WHERE bp.users_user_id = :userId AND bp.page_id = t.content
        )
    """, nativeQuery = true)
  void insertNewPagesForEmployee(@Param("userId") String employeeId);
}
