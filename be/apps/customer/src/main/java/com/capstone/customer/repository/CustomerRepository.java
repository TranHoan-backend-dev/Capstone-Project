package com.capstone.customer.repository;

import com.capstone.customer.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, String>, JpaSpecificationExecutor<Customer> {
  boolean existsByWaterPriceId(String waterPriceId);

  boolean existsByFormCodeAndFormNumber(String formCode, String formNumber);

  boolean existsByWaterMeterId(String waterMeterId);

  Optional<Customer> findTopByWaterMeterId(String waterMeterId);

  int countByRoadmapId(String roadmapId);
}
