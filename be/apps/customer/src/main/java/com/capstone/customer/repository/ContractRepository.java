package com.capstone.customer.repository;

import com.capstone.customer.model.InstallationContract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContractRepository extends JpaRepository<InstallationContract, String> {
}
