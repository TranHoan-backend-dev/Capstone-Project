package com.capstone.auth.infrastructure.persistence;

import com.capstone.auth.domain.model.EmployeeJob;
import com.capstone.auth.domain.model.utils.EmployeeJobId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeJobRepository extends JpaRepository<EmployeeJob, EmployeeJobId> {
}
