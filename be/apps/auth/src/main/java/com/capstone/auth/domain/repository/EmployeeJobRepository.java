package com.capstone.auth.domain.repository;

import com.capstone.auth.domain.model.EmployeeJob;
import com.capstone.auth.domain.model.id.EmployeeJobId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeJobRepository extends JpaRepository<EmployeeJob, EmployeeJobId> {
}
