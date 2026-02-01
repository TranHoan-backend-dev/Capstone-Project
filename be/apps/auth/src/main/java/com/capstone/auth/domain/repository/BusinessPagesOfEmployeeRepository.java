package com.capstone.auth.domain.repository;

import com.capstone.auth.domain.model.BusinessPagesOfEmployees;
import com.capstone.auth.domain.model.id.BusinessPagesOfEmployeesId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BusinessPagesOfEmployeeRepository extends JpaRepository<BusinessPagesOfEmployees, BusinessPagesOfEmployeesId> {
}
